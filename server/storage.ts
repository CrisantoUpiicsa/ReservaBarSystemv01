import { 
  users, tables, reservations, menuCategories, menuItems, inventoryItems, suppliers, stockMovements, promotions, orders, events,
  type User, type InsertUser,
  type Table, type InsertTable,
  type Reservation, type InsertReservation,
  type MenuCategory, type InsertMenuCategory,
  type MenuItem, type InsertMenuItem,
  type InventoryItem, type InsertInventoryItem,
  type Supplier, type InsertSupplier,
  type StockMovement, type InsertStockMovement,
  type Promotion, type InsertPromotion,
  type Order, type InsertOrder,
  type Event, type InsertEvent
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
    // Initialize tables with bar areas
    const areas = ["main_bar", "vip", "lounge", "terrace", "outdoor"];
    for (let i = 1; i <= 20; i++) {
      const capacity = i <= 5 ? 2 : i <= 10 ? 4 : i <= 15 ? 6 : 8;
      const status = i <= 2 ? "occupied" : i === 3 ? "reserved" : "available";
      const area = areas[Math.floor((i - 1) / 4)];
      this.tables.set(i, {
        id: i,
        number: i,
        capacity,
        status,
        location: `${area.replace('_', ' ').toUpperCase()} Area - Table ${i}`,
        area,
        createdAt: new Date(),
      });
    }

    // Initialize bar menu categories
    const categories = [
      { id: 1, name: "Premium Spirits", description: "High-end whiskey, vodka, gin", displayOrder: 1, type: "drinks" },
      { id: 2, name: "Signature Cocktails", description: "Our bartender's special creations", displayOrder: 2, type: "cocktails" },
      { id: 3, name: "Wine Selection", description: "Curated wines from around the world", displayOrder: 3, type: "drinks" },
      { id: 4, name: "Beer & Craft", description: "Local and imported beers", displayOrder: 4, type: "drinks" },
      { id: 5, name: "Bar Snacks", description: "Perfect with your drinks", displayOrder: 5, type: "snacks" },
    ];
    categories.forEach(cat => this.menuCategories.set(cat.id, cat));

    // Initialize bar menu items
    const items = [
      { id: 1, name: "Macallan 18", description: "Premium single malt whiskey", price: "45.00", categoryId: 1, available: true, imageUrl: null, alcoholContent: "43.0", ingredients: [], preparationTime: 1, popularity: 0, createdAt: new Date() },
      { id: 2, name: "Grey Goose Martini", description: "Classic vodka martini with olives", price: "18.00", categoryId: 2, available: true, imageUrl: null, alcoholContent: "30.0", ingredients: ["Grey Goose Vodka", "Dry Vermouth", "Olives"], preparationTime: 3, popularity: 0, createdAt: new Date() },
      { id: 3, name: "Caymus Cabernet", description: "Napa Valley red wine", price: "65.00", categoryId: 3, available: true, imageUrl: null, alcoholContent: "14.5", ingredients: [], preparationTime: 1, popularity: 0, createdAt: new Date() },
      { id: 4, name: "IPA Draft", description: "Local craft IPA on tap", price: "8.00", categoryId: 4, available: true, imageUrl: null, alcoholContent: "6.2", ingredients: [], preparationTime: 1, popularity: 0, createdAt: new Date() },
      { id: 5, name: "Truffle Fries", description: "Crispy fries with truffle oil and parmesan", price: "14.00", categoryId: 5, available: true, imageUrl: null, alcoholContent: null, ingredients: ["Potatoes", "Truffle Oil", "Parmesan", "Herbs"], preparationTime: 8, popularity: 0, createdAt: new Date() },
      { id: 6, name: "Charcuterie Board", description: "Selection of cured meats and cheeses", price: "24.00", categoryId: 5, available: true, imageUrl: null, alcoholContent: null, ingredients: ["Prosciutto", "Salami", "Aged Cheese", "Crackers", "Olives"], preparationTime: 5, popularity: 0, createdAt: new Date() },
    ];
    items.forEach(item => this.menuItems.set(item.id, item));

    // Initialize bar inventory
    const inventory = [
      { id: 1, name: "Macallan 18", category: "spirits", currentStock: 12, minimumStock: 5, unit: "bottles", unitPrice: "280.00", supplier: "Premium Spirits Co.", lastRestocked: new Date(), expirationDate: null, createdAt: new Date() },
      { id: 2, name: "Grey Goose Vodka", category: "spirits", currentStock: 8, minimumStock: 15, unit: "bottles", unitPrice: "45.00", supplier: "Premium Spirits Co.", lastRestocked: new Date(), expirationDate: null, createdAt: new Date() },
      { id: 3, name: "Caymus Cabernet", category: "wine", currentStock: 24, minimumStock: 12, unit: "bottles", unitPrice: "48.00", supplier: "Wine Distributors", lastRestocked: new Date(), expirationDate: null, createdAt: new Date() },
      { id: 4, name: "IPA Keg", category: "beer", currentStock: 2, minimumStock: 3, unit: "kegs", unitPrice: "150.00", supplier: "Local Brewery", lastRestocked: new Date(), expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), createdAt: new Date() },
      { id: 5, name: "Truffle Oil", category: "supplies", currentStock: 3, minimumStock: 5, unit: "bottles", unitPrice: "35.00", supplier: "Gourmet Supplies", lastRestocked: new Date(), expirationDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), createdAt: new Date() },
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
    const user: User = { 
      ...insertUser, 
      id, 
      role: insertUser.role || "customer",
      loyaltyPoints: 0,
      totalVisits: 0,
      createdAt: new Date() 
    };
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
    const table: Table = { 
      ...insertTable, 
      id, 
      status: insertTable.status || "available",
      area: insertTable.area || "main_bar",
      createdAt: new Date() 
    };
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
    const reservation: Reservation = { 
      ...insertReservation, 
      id, 
      status: insertReservation.status || "pending",
      totalAmount: "0",
      paymentStatus: "pending",
      createdAt: new Date() 
    };
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
