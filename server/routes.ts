import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertReservationSchema, insertTableSchema, insertMenuItemSchema, insertMenuCategorySchema, insertInventoryItemSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const reservations = await storage.getAllReservations();
      const tables = await storage.getAllTables();
      const today = new Date().toISOString().split('T')[0];
      const todayReservations = reservations.filter(r => r.date === today);
      const availableTables = tables.filter(t => t.status === 'available');
      
      const stats = {
        todayReservations: todayReservations.length,
        availableTables: availableTables.length,
        totalTables: tables.length,
        revenue: 2847, // Mock data for now
        satisfaction: 4.8
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Recent reservations for dashboard
  app.get("/api/dashboard/recent-reservations", async (req, res) => {
    try {
      const reservations = await storage.getAllReservations();
      const recent = reservations
        .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
        .slice(0, 5);
      res.json(recent);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent reservations" });
    }
  });

  // Tables
  app.get("/api/tables", async (req, res) => {
    try {
      const tables = await storage.getAllTables();
      res.json(tables);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tables" });
    }
  });

  app.post("/api/tables", async (req, res) => {
    try {
      const validatedData = insertTableSchema.parse(req.body);
      const table = await storage.createTable(validatedData);
      res.status(201).json(table);
    } catch (error) {
      res.status(400).json({ message: "Invalid table data" });
    }
  });

  app.patch("/api/tables/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const table = await storage.updateTableStatus(id, status);
      if (table) {
        res.json(table);
      } else {
        res.status(404).json({ message: "Table not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to update table status" });
    }
  });

  // Reservations
  app.get("/api/reservations", async (req, res) => {
    try {
      const { date, status, tableId } = req.query;
      let reservations = await storage.getAllReservations();
      
      if (date) {
        reservations = reservations.filter(r => r.date === date);
      }
      if (status && status !== 'all') {
        reservations = reservations.filter(r => r.status === status);
      }
      if (tableId) {
        reservations = reservations.filter(r => r.tableId === parseInt(tableId as string));
      }
      
      res.json(reservations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reservations" });
    }
  });

  app.post("/api/reservations", async (req, res) => {
    try {
      const validatedData = insertReservationSchema.parse(req.body);
      const reservation = await storage.createReservation(validatedData);
      res.status(201).json(reservation);
    } catch (error) {
      res.status(400).json({ message: "Invalid reservation data" });
    }
  });

  app.patch("/api/reservations/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const reservation = await storage.updateReservationStatus(id, status);
      if (reservation) {
        res.json(reservation);
      } else {
        res.status(404).json({ message: "Reservation not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to update reservation status" });
    }
  });

  app.delete("/api/reservations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteReservation(id);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Reservation not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete reservation" });
    }
  });

  // Menu Categories
  app.get("/api/menu/categories", async (req, res) => {
    try {
      const categories = await storage.getAllMenuCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu categories" });
    }
  });

  app.post("/api/menu/categories", async (req, res) => {
    try {
      const validatedData = insertMenuCategorySchema.parse(req.body);
      const category = await storage.createMenuCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ message: "Invalid category data" });
    }
  });

  // Menu Items
  app.get("/api/menu/items", async (req, res) => {
    try {
      const { categoryId } = req.query;
      let items;
      if (categoryId) {
        items = await storage.getMenuItemsByCategory(parseInt(categoryId as string));
      } else {
        items = await storage.getAllMenuItems();
      }
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu items" });
    }
  });

  app.post("/api/menu/items", async (req, res) => {
    try {
      const validatedData = insertMenuItemSchema.parse(req.body);
      const item = await storage.createMenuItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ message: "Invalid menu item data" });
    }
  });

  app.patch("/api/menu/items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const item = await storage.updateMenuItem(id, updates);
      if (item) {
        res.json(item);
      } else {
        res.status(404).json({ message: "Menu item not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to update menu item" });
    }
  });

  app.delete("/api/menu/items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteMenuItem(id);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Menu item not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete menu item" });
    }
  });

  // Inventory
  app.get("/api/inventory", async (req, res) => {
    try {
      const items = await storage.getAllInventoryItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inventory items" });
    }
  });

  app.post("/api/inventory", async (req, res) => {
    try {
      const validatedData = insertInventoryItemSchema.parse(req.body);
      const item = await storage.createInventoryItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ message: "Invalid inventory item data" });
    }
  });

  app.patch("/api/inventory/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const item = await storage.updateInventoryItem(id, updates);
      if (item) {
        res.json(item);
      } else {
        res.status(404).json({ message: "Inventory item not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to update inventory item" });
    }
  });

  app.delete("/api/inventory/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteInventoryItem(id);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Inventory item not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete inventory item" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
