import { 
  users, tables, reservations, menuCategories, menuItems, inventoryItems,
  type User, type InsertUser,
  type Table, type InsertTable,
  type Reservation, type InsertReservation,
  type MenuCategory, type InsertMenuCategory,
  type MenuItem, type InsertMenuItem,
  type InventoryItem, type InsertInventoryItem
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Table operations
  getAllTables(): Promise<Table[]>;
  getTable(id: number): Promise<Table | undefined>;
  createTable(table: InsertTable): Promise<Table>;
  updateTableStatus(id: number, status: string): Promise<Table | undefined>;

  // Reservation operations
  getAllReservations(): Promise<Reservation[]>;
  getReservation(id: number): Promise<Reservation | undefined>;
  getReservationsByDate(date: string): Promise<Reservation[]>;
  createReservation(reservation: InsertReservation): Promise<Reservation>;
  updateReservationStatus(id: number, status: string): Promise<Reservation | undefined>;
  deleteReservation(id: number): Promise<boolean>;

  // Menu operations
  getAllMenuCategories(): Promise<MenuCategory[]>;
  getAllMenuItems(): Promise<MenuItem[]>;
  getMenuItemsByCategory(categoryId: number): Promise<MenuItem[]>;
  createMenuCategory(category: InsertMenuCategory): Promise<MenuCategory>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: number, updates: Partial<InsertMenuItem>): Promise<MenuItem | undefined>;
  deleteMenuItem(id: number): Promise<boolean>;

  // Inventory operations
  getAllInventoryItems(): Promise<InventoryItem[]>;
  getInventoryItem(id: number): Promise<InventoryItem | undefined>;
  createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem>;
  updateInventoryItem(id: number, updates: Partial<InsertInventoryItem>): Promise<InventoryItem | undefined>;
  deleteInventoryItem(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tables: Map<number, Table>;
  private reservations: Map<number, Reservation>;
  private menuCategories: Map<number, MenuCategory>;
  private menuItems: Map<number, MenuItem>;
  private inventoryItems: Map<number, InventoryItem>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.tables = new Map();
    this.reservations = new Map();
    this.menuCategories = new Map();
    this.menuItems = new Map();
    this.inventoryItems = new Map();
    this.currentId = 1;
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Initialize tables
    for (let i = 1; i <= 20; i++) {
      const capacity = i <= 10 ? (i % 3 === 0 ? 6 : i % 2 === 0 ? 4 : 2) : 8;
      const status = i <= 2 ? "occupied" : i === 3 ? "reserved" : "available";
      this.tables.set(i, {
        id: i,
        number: i,
        capacity,
        status,
        location: `Floor ${Math.ceil(i / 10)}`,
        createdAt: new Date(),
      });
    }

    // Initialize menu categories
    const categories = [
      { id: 1, name: "Appetizers", description: "Start your meal right", displayOrder: 1 },
      { id: 2, name: "Main Courses", description: "Our signature dishes", displayOrder: 2 },
      { id: 3, name: "Desserts", description: "Sweet endings", displayOrder: 3 },
    ];
    categories.forEach(cat => this.menuCategories.set(cat.id, cat));

    // Initialize menu items
    const items = [
      { id: 1, name: "Crispy Calamari", description: "Fresh squid rings with marinara sauce", price: "12.99", categoryId: 1, available: true, imageUrl: null, createdAt: new Date() },
      { id: 2, name: "Bruschetta", description: "Toasted bread with fresh tomatoes and basil", price: "8.99", categoryId: 1, available: true, imageUrl: null, createdAt: new Date() },
      { id: 3, name: "Grilled Salmon", description: "Atlantic salmon with seasonal vegetables", price: "24.99", categoryId: 2, available: true, imageUrl: null, createdAt: new Date() },
      { id: 4, name: "Ribeye Steak", description: "12oz ribeye with garlic mashed potatoes", price: "32.99", categoryId: 2, available: true, imageUrl: null, createdAt: new Date() },
      { id: 5, name: "Chocolate Lava Cake", description: "Warm chocolate cake with vanilla ice cream", price: "8.99", categoryId: 3, available: true, imageUrl: null, createdAt: new Date() },
      { id: 6, name: "Tiramisu", description: "Classic Italian dessert with coffee and mascarpone", price: "7.99", categoryId: 3, available: true, imageUrl: null, createdAt: new Date() },
    ];
    items.forEach(item => this.menuItems.set(item.id, item));

    // Initialize inventory
    const inventory = [
      { id: 1, name: "Atlantic Salmon", category: "Seafood", currentStock: 25, minimumStock: 10, unit: "lbs", unitPrice: "18.99", supplier: "Fresh Seafood Co.", lastRestocked: new Date(), createdAt: new Date() },
      { id: 2, name: "Cabernet Sauvignon", category: "Beverages", currentStock: 8, minimumStock: 15, unit: "bottles", unitPrice: "45.00", supplier: "Premium Wines", lastRestocked: new Date(), createdAt: new Date() },
      { id: 3, name: "Ribeye Beef", category: "Meat", currentStock: 15, minimumStock: 8, unit: "lbs", unitPrice: "28.50", supplier: "Prime Cuts", lastRestocked: new Date(), createdAt: new Date() },
    ];
    inventory.forEach(item => this.inventoryItems.set(item.id, item));
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  // Table operations
  async getAllTables(): Promise<Table[]> {
    return Array.from(this.tables.values());
  }

  async getTable(id: number): Promise<Table | undefined> {
    return this.tables.get(id);
  }

  async createTable(insertTable: InsertTable): Promise<Table> {
    const id = this.currentId++;
    const table: Table = { ...insertTable, id, createdAt: new Date() };
    this.tables.set(id, table);
    return table;
  }

  async updateTableStatus(id: number, status: string): Promise<Table | undefined> {
    const table = this.tables.get(id);
    if (table) {
      table.status = status;
      this.tables.set(id, table);
      return table;
    }
    return undefined;
  }

  // Reservation operations
  async getAllReservations(): Promise<Reservation[]> {
    return Array.from(this.reservations.values());
  }

  async getReservation(id: number): Promise<Reservation | undefined> {
    return this.reservations.get(id);
  }

  async getReservationsByDate(date: string): Promise<Reservation[]> {
    return Array.from(this.reservations.values()).filter(r => r.date === date);
  }

  async createReservation(insertReservation: InsertReservation): Promise<Reservation> {
    const id = this.currentId++;
    const reservation: Reservation = { ...insertReservation, id, createdAt: new Date() };
    this.reservations.set(id, reservation);
    return reservation;
  }

  async updateReservationStatus(id: number, status: string): Promise<Reservation | undefined> {
    const reservation = this.reservations.get(id);
    if (reservation) {
      reservation.status = status;
      this.reservations.set(id, reservation);
      return reservation;
    }
    return undefined;
  }

  async deleteReservation(id: number): Promise<boolean> {
    return this.reservations.delete(id);
  }

  // Menu operations
  async getAllMenuCategories(): Promise<MenuCategory[]> {
    return Array.from(this.menuCategories.values()).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }

  async getAllMenuItems(): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values());
  }

  async getMenuItemsByCategory(categoryId: number): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values()).filter(item => item.categoryId === categoryId);
  }

  async createMenuCategory(insertCategory: InsertMenuCategory): Promise<MenuCategory> {
    const id = this.currentId++;
    const category: MenuCategory = { ...insertCategory, id };
    this.menuCategories.set(id, category);
    return category;
  }

  async createMenuItem(insertItem: InsertMenuItem): Promise<MenuItem> {
    const id = this.currentId++;
    const item: MenuItem = { ...insertItem, id, createdAt: new Date() };
    this.menuItems.set(id, item);
    return item;
  }

  async updateMenuItem(id: number, updates: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    const item = this.menuItems.get(id);
    if (item) {
      const updatedItem = { ...item, ...updates };
      this.menuItems.set(id, updatedItem);
      return updatedItem;
    }
    return undefined;
  }

  async deleteMenuItem(id: number): Promise<boolean> {
    return this.menuItems.delete(id);
  }

  // Inventory operations
  async getAllInventoryItems(): Promise<InventoryItem[]> {
    return Array.from(this.inventoryItems.values());
  }

  async getInventoryItem(id: number): Promise<InventoryItem | undefined> {
    return this.inventoryItems.get(id);
  }

  async createInventoryItem(insertItem: InsertInventoryItem): Promise<InventoryItem> {
    const id = this.currentId++;
    const item: InventoryItem = { ...insertItem, id, createdAt: new Date() };
    this.inventoryItems.set(id, item);
    return item;
  }

  async updateInventoryItem(id: number, updates: Partial<InsertInventoryItem>): Promise<InventoryItem | undefined> {
    const item = this.inventoryItems.get(id);
    if (item) {
      const updatedItem = { ...item, ...updates };
      this.inventoryItems.set(id, updatedItem);
      return updatedItem;
    }
    return undefined;
  }

  async deleteInventoryItem(id: number): Promise<boolean> {
    return this.inventoryItems.delete(id);
  }
}

export const storage = new MemStorage();
