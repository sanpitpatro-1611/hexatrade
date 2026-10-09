/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * MARKETLAB BY HEXAVORA — MASTER SIMULATION ENGINE
 * Comprehensive, deterministic, browser-based stock market paper-trading terminal.
 */

// ============================================================================
// 1. PSEUDORANDOM NUMBER GENERATOR (Deterministic & Seedable)
// ============================================================================

class SeededRandom {
  constructor(seed = 133742) {
    this.seed = seed;
  }

  next() {
    let t = (this.seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  range(min, max) {
    return min + this.next() * (max - min);
  }

  choice(arr) {
    return arr[Math.floor(this.next() * arr.length)];
  }

  gaussian(mean = 0, stdev = 1) {
    const u1 = Math.max(1e-7, this.next());
    const u2 = this.next();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return z0 * stdev + mean;
  }
}

// Global deterministic random instance
const rng = new SeededRandom(428190);

// ============================================================================
// 2. FICTIONAL COMPANIES MASTER DATA (14 Diverse Equities)
// ============================================================================

const COMPANIES = [
  {
    symbol: "HEXA",
    name: "Hexavora Technologies Ltd",
    sector: "Technology",
    subsector: "AI & SaaS",
    basePrice: 100.0,
    volatility: 0.024,
    liquidity: "High",
    pe: 28.4,
    marketCap: "₹10.0 Cr",
    sharesOutstanding: 1000000,
    isIPO: true,
    ipoStatus: "ANNOUNCEMENT", // ANNOUNCEMENT -> SUBSCRIPTION -> ALLOTMENT -> LISTED
    description: "Enterprise multi-agent autonomous AI and cloud workflow automation platforms."
  },
  {
    symbol: "NXOR",
    name: "Nexora Technologies",
    sector: "Technology",
    subsector: "Enterprise Cloud & AI",
    basePrice: 1420.0,
    volatility: 0.018,
    liquidity: "High",
    pe: 34.2,
    marketCap: "₹85,000 Cr",
    sharesOutstanding: 600000000,
    description: "Cloud infrastructure and sovereign enterprise generative AI platforms."
  },
  {
    symbol: "MRDN",
    name: "Meridian Bank",
    sector: "Banking",
    subsector: "Private Banking & Credit",
    basePrice: 850.0,
    volatility: 0.012,
    liquidity: "Very High",
    pe: 14.8,
    marketCap: "₹1,20,000 Cr",
    sharesOutstanding: 1400000000,
    description: "Full-service commercial bank with digital retail lending and corporate treasury."
  },
  {
    symbol: "SOLV",
    name: "Solvanta Energy",
    sector: "Energy",
    subsector: "Solar & Green Hydrogen",
    basePrice: 340.0,
    volatility: 0.025,
    liquidity: "Moderate",
    pe: 42.1,
    marketCap: "₹24,000 Cr",
    sharesOutstanding: 700000000,
    description: "Solar photovoltaic gigafactories and green hydrogen electrolysis plants."
  },
  {
    symbol: "AURA",
    name: "Auravita Healthcare",
    sector: "Healthcare",
    subsector: "Biopharma & Formulations",
    basePrice: 620.0,
    volatility: 0.015,
    liquidity: "High",
    pe: 22.6,
    marketCap: "₹48,000 Cr",
    sharesOutstanding: 770000000,
    description: "Specialty biologics, cardiovascular oncology, and API manufacturing."
  },
  {
    symbol: "VIST",
    name: "Vistara Consumer",
    sector: "FMCG",
    subsector: "Packaged Foods & Wellness",
    basePrice: 480.0,
    volatility: 0.009,
    liquidity: "High",
    pe: 46.5,
    marketCap: "₹62,000 Cr",
    sharesOutstanding: 1290000000,
    description: "Staples, dairy beverages, and personal hygiene products with nationwide distribution."
  },
  {
    symbol: "TITN",
    name: "Titan Forge Industrials",
    sector: "Industrial",
    subsector: "Heavy Machinery & Defense",
    basePrice: 920.0,
    volatility: 0.017,
    liquidity: "Moderate",
    pe: 26.3,
    marketCap: "₹38,000 Cr",
    sharesOutstanding: 410000000,
    description: "Turbines, defense aerospace forgings, and railway bogie systems."
  },
  {
    symbol: "ZENI",
    name: "Zenith Telecom",
    sector: "Technology",
    subsector: "5G & Optical Networks",
    basePrice: 195.0,
    volatility: 0.014,
    liquidity: "High",
    pe: 18.2,
    marketCap: "₹52,000 Cr",
    sharesOutstanding: 2600000000,
    description: "Fiber-to-the-home and 5G cellular telecom towers spanning rural & urban corridors."
  },
  {
    symbol: "KRNX",
    name: "Kronos Automotive",
    sector: "Industrial",
    subsector: "EV Motors & Commercial Mobility",
    basePrice: 1150.0,
    volatility: 0.022,
    liquidity: "Moderate",
    pe: 31.0,
    marketCap: "₹42,000 Cr",
    sharesOutstanding: 365000000,
    description: "Electric bus powertrains and smart commercial logistics fleet manufacture."
  },
  {
    symbol: "INFR",
    name: "Bharat Infra Build",
    sector: "Industrial",
    subsector: "Expressways & Metro Rails",
    basePrice: 275.0,
    volatility: 0.016,
    liquidity: "Moderate",
    pe: 15.4,
    marketCap: "₹28,000 Cr",
    sharesOutstanding: 1010000000,
    description: "EPC infrastructure contractor building tollways, ports, and underground tunnels."
  },
  {
    symbol: "PLSE",
    name: "Pulse Diagnostics",
    sector: "Healthcare",
    subsector: "Digital Pathology & Clinics",
    basePrice: 510.0,
    volatility: 0.013,
    liquidity: "Moderate",
    pe: 27.9,
    marketCap: "₹18,000 Cr",
    sharesOutstanding: 350000000,
    description: "Network of diagnostic laboratories and automated medical imaging centers."
  },
  {
    symbol: "STEL",
    name: "Apex Steel & Alloys",
    sector: "Industrial",
    subsector: "Green Metallics & Rebars",
    basePrice: 390.0,
    volatility: 0.023,
    liquidity: "High",
    pe: 11.2,
    marketCap: "₹35,000 Cr",
    sharesOutstanding: 890000000,
    description: "Electric arc furnace steel producer serving auto and civil engineering sectors."
  },
  {
    symbol: "CAPX",
    name: "Capital First Finvest",
    sector: "Banking",
    subsector: "NBFC & Wealth Tech",
    basePrice: 730.0,
    volatility: 0.019,
    liquidity: "Moderate",
    pe: 19.5,
    marketCap: "₹21,000 Cr",
    sharesOutstanding: 287000000,
    description: "Microfinance and SME secured lending with algorithmic credit scoring."
  },
  {
    symbol: "AGRO",
    name: "Greenfield Agro Products",
    sector: "FMCG",
    subsector: "Organic Agri & Spices",
    basePrice: 215.0,
    volatility: 0.014,
    liquidity: "Moderate",
    pe: 17.6,
    marketCap: "₹12,000 Cr",
    sharesOutstanding: 558000000,
    description: "Contract farming, cold-chain preservation, and premium spice exports."
  }
];

// ============================================================================
// 3. ORDER BOOK & MATCHING ENGINE
// ============================================================================

class OrderBook {
  constructor(symbol) {
    this.symbol = symbol;
    this.bids = []; // [{ id, price, qty, timestamp, participantId, isUser }] sorted desc by price
    this.asks = []; // [{ id, price, qty, timestamp, participantId, isUser }] sorted asc by price
    this.trades = []; // Historical trade executions
  }

  addOrder(order) {
    if (order.side === "BUY") {
      this.bids.push(order);
      this.bids.sort((a, b) => b.price - a.price || a.timestamp - b.timestamp);
    } else {
      this.asks.push(order);
      this.asks.sort((a, b) => a.price - b.price || a.timestamp - b.timestamp);
    }
  }

  cancelOrder(orderId) {
    const bidIdx = this.bids.findIndex(o => o.id === orderId);
    if (bidIdx !== -1) {
      const removed = this.bids.splice(bidIdx, 1)[0];
      return removed;
    }
    const askIdx = this.asks.findIndex(o => o.id === orderId);
    if (askIdx !== -1) {
      const removed = this.asks.splice(askIdx, 1)[0];
      return removed;
    }
    return null;
  }

  getBestBid() {
    return this.bids.length > 0 ? this.bids[0].price : null;
  }

  getBestAsk() {
    return this.asks.length > 0 ? this.asks[0].price : null;
  }

  getSpread() {
    const bb = this.getBestBid();
    const ba = this.getBestAsk();
    if (bb !== null && ba !== null) {
      return Math.max(0.05, +(ba - bb).toFixed(2));
    }
    return 0.10;
  }

  getDepth(levels = 5) {
    // Aggregate by unique price
    const aggBids = [];
    for (const b of this.bids) {
      const existing = aggBids.find(x => Math.abs(x.price - b.price) < 0.01);
      if (existing) {
        existing.qty += b.qty;
      } else {
        aggBids.push({ price: b.price, qty: b.qty });
        if (aggBids.length >= levels) break;
      }
    }

    const aggAsks = [];
    for (const a of this.asks) {
      const existing = aggAsks.find(x => Math.abs(x.price - a.price) < 0.01);
      if (existing) {
        existing.qty += a.qty;
      } else {
        aggAsks.push({ price: a.price, qty: a.qty });
        if (aggAsks.length >= levels) break;
      }
    }

    return { bids: aggBids, asks: aggAsks };
  }
}

class MatchingEngine {
  constructor(simulation) {
    this.sim = simulation;
  }

  /**
   * Matches compatible orders using strict Price-Time priority.
   * Execution price is determined by the resting order.
   */
  match(symbol) {
    const book = this.sim.orderBooks[symbol];
    if (!book) return [];

    const executedTrades = [];

    while (book.bids.length > 0 && book.asks.length > 0) {
      const topBid = book.bids[0];
      const topAsk = book.asks[0];

      // Cross condition
      if (topBid.price >= topAsk.price) {
        // Price-time execution rule: Resting order set the price
        const execPrice = topBid.timestamp <= topAsk.timestamp ? topBid.price : topAsk.price;
        const execQty = Math.min(topBid.qty, topAsk.qty);

        topBid.qty -= execQty;
        topAsk.qty -= execQty;

        const trade = {
          tradeId: "TRD-" + Math.random().toString(36).substr(2, 8).toUpperCase(),
          symbol,
          price: execPrice,
          qty: execQty,
          timestamp: this.sim.clock.getCurrentSimTimestamp(),
          bidOrder: topBid,
          askOrder: topAsk,
          timeString: this.sim.clock.getFormattedTime()
        };

        executedTrades.push(trade);
        book.trades.push(trade);

        // Update company LTP and intraday stats
        this.sim.updateCompanyPrice(symbol, execPrice, execQty, trade);

        // Process accounting if user is involved
        if (topBid.isUser || topAsk.isUser) {
          this.sim.accounting.processExecution(trade);
        }

        // Clean up filled orders
        if (topBid.qty <= 0) book.bids.shift();
        if (topAsk.qty <= 0) book.asks.shift();
      } else {
        break; // No further crosses
      }
    }

    return executedTrades;
  }
}

// ============================================================================
// 4. SIMULATION CLOCK (Accelerated Indian Market Hours 09:15 to 15:30 IST)
// ============================================================================

class SimulationClock {
  constructor(sim) {
    this.sim = sim;
    this.day = 1;
    this.hour = 9;
    this.minute = 15;
    this.second = 0;
    this.speedMultiplier = 1; // 1x, 2x, 5x, 10x
    this.isPaused = false;
    this.status = "OPEN"; // OPEN, PAUSED, CLOSED
    this.timerId = null;
  }

  start() {
    if (this.timerId) clearInterval(this.timerId);
    this.timerId = setInterval(() => this.tick(), 1000);
  }

  tick() {
    if (this.isPaused || this.status === "CLOSED") return;

    // Each real second advances (15 * speedMultiplier) simulated seconds
    const advanceSec = 15 * this.speedMultiplier;
    this.second += advanceSec;

    while (this.second >= 60) {
      this.second -= 60;
      this.minute++;
    }
    while (this.minute >= 60) {
      this.minute -= 60;
      this.hour++;
    }

    // Check market session close at 15:30 IST
    if (this.hour > 15 || (this.hour === 15 && this.minute >= 30)) {
      this.closeSession();
    } else {
      this.sim.onClockTick();
    }
  }

  closeSession() {
    this.status = "CLOSED";
    this.sim.onSessionClose();
  }

  nextDay() {
    this.day++;
    this.hour = 9;
    this.minute = 15;
    this.second = 0;
    this.status = "OPEN";
    this.sim.onNewDayStart();
  }

  setSpeed(mult) {
    this.speedMultiplier = mult;
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    return this.isPaused;
  }

  getFormattedTime() {
    const hh = String(this.hour).padStart(2, "0");
    const mm = String(this.minute).padStart(2, "0");
    const period = this.hour >= 12 ? "PM" : "AM";
    const displayH = this.hour > 12 ? this.hour - 12 : this.hour;
    return `${String(displayH).padStart(2, "0")}:${mm} ${period} IST | Day ${this.day}`;
  }

  getCurrentSimTimestamp() {
    return `D${this.day}-${String(this.hour).padStart(2, "0")}:${String(this.minute).padStart(2, "0")}:${String(this.second).padStart(2, "0")}`;
  }
}

// ============================================================================
// 5. ACCOUNTING & TRANSACTION LEDGER
// ============================================================================

class AccountingLedger {
  constructor(sim) {
    this.sim = sim;
    this.initialCash = 10000.0;
    this.availableCash = 10000.0;
    this.reservedCash = 0.0; // Locked for pending BUY limit orders
    this.holdings = {}; // { SYMBOL: { qty: 0, avgPrice: 0 } }
    this.ledger = []; // Immutable financial transaction history
    this.orders = []; // User submitted orders
    this.openOrders = [];
    this.realisedPnL = 0.0;
    this.totalFeesPaid = 0.0;
    this.dailyEquitySnapshots = [{ day: 1, equity: 10000.0 }];
  }

  calculateCharges(grossAmount) {
    // Simulated Indian Charges:
    // Brokerage: 0.01% or ₹5 max
    // STT: 0.01%
    // Exchange Turnover & GST: ~0.005%
    const brokerage = Math.min(5.0, Math.max(0.05, +(grossAmount * 0.0001).toFixed(2)));
    const stt = +(grossAmount * 0.0001).toFixed(2);
    const gstAndExch = +(brokerage * 0.18 + grossAmount * 0.0000345).toFixed(2);
    const total = +(brokerage + stt + gstAndExch).toFixed(2);
    return { brokerage, stt, gstAndExch, total };
  }

  placeOrder({ symbol, side, type, qty, price }) {
    qty = parseInt(qty, 10);
    price = +parseFloat(price).toFixed(2);

    if (qty <= 0) return { success: false, reason: "Quantity must be greater than zero." };

    const company = this.sim.companies.find(c => c.symbol === symbol);
    if (!company) return { success: false, reason: "Unknown stock symbol." };

    // Check if stock is in pre-listing IPO stage
    if (company.isIPO && company.ipoStatus !== "LISTED") {
      return { success: false, reason: `${symbol} is an unlisted IPO. Apply via the Hexavora IPO tab.` };
    }

    const currentLtp = company.ltp || company.basePrice;
    const estPrice = type === "MARKET" ? (side === "BUY" ? (company.ask || currentLtp * 1.002) : (company.bid || currentLtp * 0.998)) : price;
    const gross = +(qty * estPrice).toFixed(2);
    const charges = this.calculateCharges(gross);
    const totalRequired = +(gross + charges.total).toFixed(2);

    if (side === "BUY") {
      if (totalRequired > this.availableCash) {
        return {
          success: false,
          reason: `Insufficient virtual cash. Required: ₹${totalRequired.toLocaleString("en-IN")}, Available: ₹${this.availableCash.toLocaleString("en-IN")}`
        };
      }

      // Reserve funds
      this.availableCash -= totalRequired;
      this.reservedCash += totalRequired;
    } else {
      // SELL order: Check owned quantity
      const holding = this.holdings[symbol] || { qty: 0, avgPrice: 0 };
      const currentlyReservedShares = this.openOrders
        .filter(o => o.symbol === symbol && o.side === "SELL")
        .reduce((sum, o) => sum + (o.qty - o.filledQty), 0);

      if (qty > (holding.qty - currentlyReservedShares)) {
        return {
          success: false,
          reason: `Insufficient shares. Owned: ${holding.qty}, Already Open for Sale: ${currentlyReservedShares}`
        };
      }
    }

    const order = {
      id: "ORD-" + Math.random().toString(36).substr(2, 7).toUpperCase(),
      symbol,
      side,
      type,
      qty,
      filledQty: 0,
      price: type === "MARKET" ? 0 : price,
      reservedCash: side === "BUY" ? totalRequired : 0,
      status: "OPEN",
      timestamp: this.sim.clock.getCurrentSimTimestamp(),
      timeString: this.sim.clock.getFormattedTime(),
      isUser: true
    };

    this.orders.push(order);
    this.openOrders.push(order);

    // Insert into exchange book
    const bookOrder = {
      id: order.id,
      price: type === "MARKET" ? (side === "BUY" ? 999999 : 0.05) : price,
      qty,
      timestamp: Date.now(),
      isUser: true,
      side,
      parentOrder: order
    };

    this.sim.orderBooks[symbol].addOrder(bookOrder);

    // Execute matching engine immediately
    this.sim.matchingEngine.match(symbol);

    this.sim.journalTrade({
      time: order.timeString,
      tag: "Discipline Check",
      stock: symbol,
      summary: `${side} ${qty} shs @ ${type} (Status: ${order.status})`,
      note: `Virtual order placed via terminal.`
    });

    return { success: true, order };
  }

  cancelOrder(orderId) {
    const idx = this.openOrders.findIndex(o => o.id === orderId);
    if (idx === -1) return false;

    const order = this.openOrders[idx];
    this.openOrders.splice(idx, 1);
    order.status = "CANCELLED";

    // Release unexecuted reserved cash
    if (order.side === "BUY" && order.reservedCash > 0) {
      this.reservedCash -= order.reservedCash;
      this.availableCash += order.reservedCash;
      order.reservedCash = 0;
    }

    // Remove from orderbook
    this.sim.orderBooks[order.symbol].cancelOrder(orderId);
    this.sim.ui.renderAll();
    return true;
  }

  processExecution(trade) {
    const isUserBuy = trade.bidOrder.isUser;
    const isUserSell = trade.askOrder.isUser;

    if (!isUserBuy && !isUserSell) return;

    const symbol = trade.symbol;
    const price = trade.price;
    const qty = trade.qty;
    const gross = +(price * qty).toFixed(2);
    const charges = this.calculateCharges(gross);
    this.totalFeesPaid += charges.total;

    if (isUserBuy) {
      const parentOrder = trade.bidOrder.parentOrder || this.orders.find(o => o.id === trade.bidOrder.id);
      if (parentOrder) {
        parentOrder.filledQty += qty;
        if (parentOrder.filledQty >= parentOrder.qty) {
          parentOrder.status = "FILLED";
          const openIdx = this.openOrders.findIndex(o => o.id === parentOrder.id);
          if (openIdx !== -1) this.openOrders.splice(openIdx, 1);
        } else {
          parentOrder.status = "PARTIAL";
        }
      }

      // Accounting adjustment: deduct from reserved cash and settle net cost
      const actualCost = +(gross + charges.total).toFixed(2);
      if (parentOrder && parentOrder.reservedCash >= actualCost) {
        parentOrder.reservedCash -= actualCost;
        this.reservedCash -= actualCost;
      } else {
        const diff = actualCost - (parentOrder ? parentOrder.reservedCash : 0);
        this.reservedCash -= (parentOrder ? parentOrder.reservedCash : 0);
        this.availableCash -= diff;
        if (parentOrder) parentOrder.reservedCash = 0;
      }

      // Update holdings weighted average
      const cur = this.holdings[symbol] || { qty: 0, avgPrice: 0 };
      const newTotalQty = cur.qty + qty;
      const newAvgCost = +(((cur.qty * cur.avgPrice) + gross) / newTotalQty).toFixed(2);
      this.holdings[symbol] = { qty: newTotalQty, avgPrice: newAvgCost };

      // Record in authoritative ledger
      this.ledger.push({
        txId: "TX-" + Math.random().toString(36).substr(2, 8).toUpperCase(),
        time: trade.timeString,
        type: "BUY",
        symbol,
        qty,
        price,
        charges: charges.total,
        netAmount: -actualCost,
        realisedPnL: 0,
        cashBalance: +(this.availableCash).toFixed(2)
      });
    }

    if (isUserSell) {
      const parentOrder = trade.askOrder.parentOrder || this.orders.find(o => o.id === trade.askOrder.id);
      if (parentOrder) {
        parentOrder.filledQty += qty;
        if (parentOrder.filledQty >= parentOrder.qty) {
          parentOrder.status = "FILLED";
          const openIdx = this.openOrders.findIndex(o => o.id === parentOrder.id);
          if (openIdx !== -1) this.openOrders.splice(openIdx, 1);
        } else {
          parentOrder.status = "PARTIAL";
        }
      }

      // Calculate Realised P&L using Average Cost Method
      const cur = this.holdings[symbol] || { qty: 0, avgPrice: 0 };
      const costBasis = +(cur.avgPrice * qty).toFixed(2);
      const netProceeds = +(gross - charges.total).toFixed(2);
      const tradePnL = +(netProceeds - costBasis).toFixed(2);
      this.realisedPnL += tradePnL;

      // Credit cash
      this.availableCash += netProceeds;

      // Update holdings
      const remainingQty = cur.qty - qty;
      if (remainingQty <= 0) {
        delete this.holdings[symbol];
      } else {
        cur.qty = remainingQty;
      }

      // Record in authoritative ledger
      this.ledger.push({
        txId: "TX-" + Math.random().toString(36).substr(2, 8).toUpperCase(),
        time: trade.timeString,
        type: "SELL",
        symbol,
        qty,
        price,
        charges: charges.total,
        netAmount: netProceeds,
        realisedPnL: tradePnL,
        cashBalance: +(this.availableCash).toFixed(2)
      });
    }

    // Refresh UI & Check Academy goals
    this.sim.ui.renderAll();
    this.sim.academy.evaluateProgress();
  }

  getTotalEquity() {
    let holdingsValue = 0;
    for (const sym in this.holdings) {
      const h = this.holdings[sym];
      const comp = this.sim.companies.find(c => c.symbol === sym);
      const ltp = comp ? (comp.ltp || comp.basePrice) : h.avgPrice;
      holdingsValue += h.qty * ltp;
    }
    return +(this.availableCash + this.reservedCash + holdingsValue).toFixed(2);
  }

  getUnrealisedPnL() {
    let totalUnrealised = 0;
    for (const sym in this.holdings) {
      const h = this.holdings[sym];
      const comp = this.sim.companies.find(c => c.symbol === sym);
      const ltp = comp ? (comp.ltp || comp.basePrice) : h.avgPrice;
      totalUnrealised += (ltp - h.avgPrice) * h.qty;
    }
    return +totalUnrealised.toFixed(2);
  }
}

// ============================================================================
// 6. SIMULATED PARTICIPANTS & MARKET DYNAMICS (Rule-Based Order Flow)
// ============================================================================

class ParticipantEngine {
  constructor(sim) {
    this.sim = sim;
    this.regime = "BULLISH"; // BULLISH, BEARISH, SIDEWAYS
    this.regimeDuration = 25;
  }

  tick() {
    this.regimeDuration--;
    if (this.regimeDuration <= 0) {
      // Regime transition
      const regimes = ["BULLISH", "SIDEWAYS", "BEARISH", "BULLISH", "SIDEWAYS"];
      this.regime = rng.choice(regimes);
      this.regimeDuration = Math.floor(rng.range(20, 50));
      this.sim.onRegimeChange(this.regime);
    }

    // Generate orders for companies
    for (const comp of this.sim.companies) {
      if (comp.isIPO && comp.ipoStatus !== "LISTED") continue;

      const book = this.sim.orderBooks[comp.symbol];
      const fair = comp.fairValue || comp.basePrice;
      const vol = comp.volatility;

      // 1. Liquidity Provider / Market Maker: keeps bids & asks near fair value
      const depth = book.getDepth(5);
      if (depth.bids.length < 3) {
        const bidPrice = +(fair * (1 - rng.range(0.001, 0.006))).toFixed(2);
        const bidQty = Math.floor(rng.range(10, 80));
        book.addOrder({
          id: "MM-B-" + Math.random().toString(36).substr(2, 6),
          price: bidPrice,
          qty: bidQty,
          timestamp: Date.now(),
          isUser: false,
          side: "BUY"
        });
      }
      if (depth.asks.length < 3) {
        const askPrice = +(fair * (1 + rng.range(0.001, 0.006))).toFixed(2);
        const askQty = Math.floor(rng.range(10, 80));
        book.addOrder({
          id: "MM-A-" + Math.random().toString(36).substr(2, 6),
          price: askPrice,
          qty: askQty,
          timestamp: Date.now(),
          isUser: false,
          side: "SELL"
        });
      }

      // 2. Momentum & Sentiment Participant Orders
      if (rng.next() < 0.35) {
        const isBullishBias = this.regime === "BULLISH" ? 0.65 : (this.regime === "BEARISH" ? 0.35 : 0.50);
        const willBuy = rng.next() < isBullishBias;
        const currentLtp = comp.ltp || fair;
        const offset = rng.gaussian(0, vol * 0.4);
        const price = +(currentLtp * (1 + offset)).toFixed(2);
        const qty = Math.floor(rng.range(5, 50));

        if (willBuy) {
          book.addOrder({
            id: "TRD-B-" + Math.random().toString(36).substr(2, 6),
            price: Math.max(0.1, price),
            qty,
            timestamp: Date.now(),
            isUser: false,
            side: "BUY"
          });
        } else {
          book.addOrder({
            id: "TRD-S-" + Math.random().toString(36).substr(2, 6),
            price: Math.max(0.1, price),
            qty,
            timestamp: Date.now(),
            isUser: false,
            side: "SELL"
          });
        }

        // Trigger matching
        this.sim.matchingEngine.match(comp.symbol);
      }
    }
  }
}

// ============================================================================
// 7. EVENTS & NEWS ENGINE (Rule-Based Catalysts)
// ============================================================================

const SIMULATED_NEWS_EVENTS = [
  {
    headline: "Nexora Technologies secures ₹2,400 Cr AI sovereign cloud contract with state agencies.",
    sector: "Technology",
    symbols: ["NXOR", "HEXA"],
    sentiment: 0.04
  },
  {
    headline: "RBI leaves benchmark Repo Rate unchanged at 6.50%; forecasts robust 7.2% GDP growth.",
    sector: "Economy",
    symbols: ["MRDN", "CAPX", "INFR"],
    sentiment: 0.02
  },
  {
    headline: "Solvanta Energy commissions Asia's largest 500MW green hydrogen electrolysis module.",
    sector: "Energy",
    symbols: ["SOLV"],
    sentiment: 0.06
  },
  {
    headline: "Crude oil spikes +3.2% amid global shipping lane tensions; pressure on import margins.",
    sector: "Industrial",
    symbols: ["STEL", "KRNX"],
    sentiment: -0.025
  },
  {
    headline: "Auravita Healthcare obtains US FDA clearance for oncology bio-equivalent injection.",
    sector: "Healthcare",
    symbols: ["AURA", "PLSE"],
    sentiment: 0.045
  },
  {
    headline: "Monsoon rainfall exceeds long-term average by 6%; rural FMCG demand surges.",
    sector: "FMCG",
    symbols: ["VIST", "AGRO"],
    sentiment: 0.03
  },
  {
    headline: "Titan Forge Industrials bags ₹1,850 Cr precision defense defense order from Navy.",
    sector: "Industrial",
    symbols: ["TITN"],
    sentiment: 0.05
  },
  {
    headline: "Hexavora Technologies announces revolutionary Autonomous Multi-Agent SaaS engine ahead of IPO.",
    sector: "Technology",
    symbols: ["HEXA"],
    sentiment: 0.08
  }
];

class EventEngine {
  constructor(sim) {
    this.sim = sim;
    this.history = [];
    this.lastEventIndex = 0;
  }

  tick() {
    // Fire a news event periodically
    if (rng.next() < 0.12) {
      const event = SIMULATED_NEWS_EVENTS[this.lastEventIndex % SIMULATED_NEWS_EVENTS.length];
      this.lastEventIndex++;

      this.history.push({
        time: this.sim.clock.getFormattedTime(),
        ...event
      });

      // Update fair value of affected companies
      for (const sym of event.symbols) {
        const comp = this.sim.companies.find(c => c.symbol === sym);
        if (comp) {
          comp.fairValue = +(comp.fairValue * (1 + event.sentiment)).toFixed(2);
        }
      }

      // Update UI marquee
      const marquee = document.getElementById("newsMarqueeText");
      if (marquee) {
        marquee.textContent = `[${event.sector}] ${event.headline}`;
      }
    }
  }
}

// ============================================================================
// 8. THE ACADEMY ENGINE (7 Locked Levels & Practical Challenges)
// ============================================================================

const ACADEMY_LEVELS = [
  {
    id: 1,
    title: "Market Foundations",
    shortTitle: "Foundations",
    desc: "Understand what shares are, how buyers and sellers interact, bid/ask spreads, and basic cash balances.",
    prereqText: "None — Start Here",
    challenge: "Execute at least 2 simulated BUY orders with proper quantity sizing.",
    quiz: [
      {
        q: "What does the Last Traded Price (LTP) of a share represent?",
        opts: [
          "The price agreed upon in the most recent executed trade.",
          "The highest price a seller is asking for.",
          "The average book value calculated by the stock exchange."
        ],
        ans: 0,
        explanation: "LTP is the exact price at which the latest transaction between a buyer and seller took place."
      },
      {
        q: "If your available virtual cash is ₹10,000 and you buy ₹3,000 of shares, what happens to your Portfolio Equity?",
        opts: [
          "Equity drops to ₹7,000 immediately.",
          "Equity remains ₹10,000 (minus negligible simulated charges) as cash converts into share holdings.",
          "Equity doubles automatically."
        ],
        ans: 1,
        explanation: "Buying shares is an asset conversion: cash decreases, but share holdings of equivalent market value are added."
      }
    ]
  },
  {
    id: 2,
    title: "Trading Mechanics & Order Books",
    shortTitle: "Mechanics",
    desc: "Master Market Orders vs Limit Orders, order book depth, liquidity priority, and partial fills.",
    prereqText: "Complete Level 1",
    challenge: "Place at least 1 LIMIT order and cancel another pending order from the book.",
    quiz: [
      {
        q: "How does a LIMIT BUY order differ from a MARKET BUY order?",
        opts: [
          "A Limit Buy will only execute at or below your specified limit price, never higher.",
          "A Limit Buy executes instantly regardless of price.",
          "A Limit Buy borrows leverage from the broker."
        ],
        ans: 0,
        explanation: "Limit orders protect the trader by ensuring execution only at the chosen price or better."
      },
      {
        q: "In an exchange order book, which order has highest priority among multiple buyers?",
        opts: [
          "The order with the largest quantity.",
          "The highest bid price, and earliest submission time at identical prices.",
          "The order submitted by institutional participants."
        ],
        ans: 1,
        explanation: "Exchanges use Price-Time Priority: highest price for buyers and earliest timestamp at identical prices."
      }
    ]
  },
  {
    id: 3,
    title: "Risk Management & Position Sizing",
    shortTitle: "Risk Management",
    desc: "Learn capital preservation, the 2% risk rule, drawdown control, and transaction cost impact.",
    prereqText: "Complete Level 2",
    challenge: "Maintain total portfolio drawdown below 5% while executing 3 separate trades.",
    quiz: [
      {
        q: "Why is risking 100% of your account on a single stock dangerous?",
        opts: [
          "A single adverse price gap can wipe out the majority of your capital, making recovery mathematically difficult.",
          "Stock exchanges automatically cancel large orders.",
          "Brokerages charge double fees for concentrated orders."
        ],
        ans: 0,
        explanation: "A 50% loss requires a 100% gain just to break even. Position sizing prevents catastrophic drawdowns."
      }
    ]
  },
  {
    id: 4,
    title: "Technical Analysis & Charting",
    shortTitle: "Technical Analysis",
    desc: "Interpret Candlestick OHLC bars, volume confirmation, moving averages, and support/resistance.",
    prereqText: "Complete Level 3",
    challenge: "Execute a trade following a confirmed Moving Average breakout.",
    quiz: [
      {
        q: "What does a green candlestick indicate on a chart?",
        opts: [
          "The closing price of the interval was higher than the opening price.",
          "The stock had zero volume during the timeframe.",
          "The company paid a cash dividend."
        ],
        ans: 0,
        explanation: "Green candles show positive price discovery within the timeframe where close > open."
      }
    ]
  },
  {
    id: 5,
    title: "Swing Trading & Overnight Risk",
    shortTitle: "Swing Trading",
    desc: "Hold positions across consecutive simulated trading sessions and navigate market opening gaps.",
    prereqText: "Complete Level 4",
    challenge: "Carry at least 1 stock holding overnight into the next simulated day.",
    quiz: [
      {
        q: "What causes a morning opening price gap between trading days?",
        opts: [
          "New information, news, or earnings released while the exchange was closed shifting overnight order demand.",
          "The exchange resets all stock prices to book value overnight.",
          "Dividends are automatically subtracted every midnight."
        ],
        ans: 0,
        explanation: "Overnight news shifts buyer and seller valuations before the morning opening bell."
      }
    ]
  },
  {
    id: 6,
    title: "Fundamental Investing & Valuation",
    shortTitle: "Fundamentals",
    desc: "Evaluate Price-to-Earnings (P/E), revenue growth, balance sheets, and sector diversification.",
    prereqText: "Complete Level 5",
    challenge: "Hold a diversified portfolio across at least 3 distinct sectors.",
    quiz: [
      {
        q: "What does the P/E (Price to Earnings) ratio measure?",
        opts: [
          "How much investors are paying per rupee of current net company earnings.",
          "The total volume of shares traded in one year.",
          "The percentage dividend yield."
        ],
        ans: 0,
        explanation: "P/E compares market price per share to earnings per share, indicating market valuation multiples."
      }
    ]
  },
  {
    id: 7,
    title: "Advanced Market Lab Capstone",
    shortTitle: "Capstone",
    desc: "Master regime shifts, liquidity droughts, execution slippage, and portfolio hedging.",
    prereqText: "Complete Level 6",
    challenge: "Complete a full multi-day cycle with positive risk-adjusted consistency.",
    quiz: [
      {
        q: "What is execution slippage in financial markets?",
        opts: [
          "The difference between expected order price and the actual executed price caused by insufficient liquidity.",
          "A clerical error made by an exchange clearinghouse.",
          "The commission fee retained by your bank."
        ],
        ans: 0,
        explanation: "Large market orders consume multiple order book levels, causing slippage above the initial best quote."
      }
    ]
  }
];

class AcademyEngine {
  constructor(sim) {
    this.sim = sim;
    this.unlockedLevel = 1;
    this.completedLevels = [];
    this.masteryScore = 80;
  }

  evaluateProgress() {
    const acct = this.sim.accounting;
    const completedOrders = acct.orders.filter(o => o.status === "FILLED" || o.status === "PARTIAL").length;
    const cancelledOrders = acct.orders.filter(o => o.status === "CANCELLED").length;

    // Level 1: Execute at least 2 buy orders
    if (this.unlockedLevel === 1 && completedOrders >= 2 && !this.completedLevels.includes(1)) {
      this.completedLevels.push(1);
      this.unlockedLevel = 2;
      this.sim.ui.showToast("🏆 Level 1 Passed: Market Foundations! Level 2 Unlocked.", "toast-success");
    }

    // Level 2: Place limit order & cancel another
    if (this.unlockedLevel === 2 && cancelledOrders >= 1 && completedOrders >= 3 && !this.completedLevels.includes(2)) {
      this.completedLevels.push(2);
      this.unlockedLevel = 3;
      this.sim.ui.showToast("🏆 Level 2 Passed: Trading Mechanics! Level 3 Unlocked.", "toast-success");
    }

    // Level 5: Overnight position carried
    if (this.sim.clock.day >= 2 && Object.keys(acct.holdings).length > 0 && this.unlockedLevel === 5 && !this.completedLevels.includes(5)) {
      this.completedLevels.push(5);
      this.unlockedLevel = 6;
      this.sim.ui.showToast("🏆 Level 5 Passed: Swing Trading! Level 6 Unlocked.", "toast-success");
    }

    // Level 6: 3 Sectors Diversification
    const sectors = new Set();
    for (const sym in acct.holdings) {
      const c = this.sim.companies.find(x => x.symbol === sym);
      if (c) sectors.add(c.sector);
    }
    if (sectors.size >= 3 && this.unlockedLevel === 6 && !this.completedLevels.includes(6)) {
      this.completedLevels.push(6);
      this.unlockedLevel = 7;
      this.sim.ui.showToast("🏆 Level 6 Passed: Fundamental Investing! Level 7 Unlocked.", "toast-success");
    }

    this.sim.ui.renderAcademy();
  }
}

// ============================================================================
// 9. HEXAVORA IPO SIMULATOR (5 Stages)
// ============================================================================

class IPOSimulator {
  constructor(sim) {
    this.sim = sim;
    this.stage = "ANNOUNCEMENT"; // ANNOUNCEMENT -> SUBSCRIPTION -> ALLOTMENT -> LISTED
    this.appliedLots = 0;
    this.appliedShares = 0;
    this.allottedShares = 0;
    this.reservedCash = 0;
    this.issuePrice = 100.0;
    this.lotSize = 50;
    this.listingDay = 5;
  }

  tick() {
    const day = this.sim.clock.day;

    if (day >= 2 && day <= 4 && this.stage === "ANNOUNCEMENT") {
      this.stage = "SUBSCRIPTION";
      this.sim.ui.showToast("📢 Hexavora Technologies IPO is now OPEN for Retail Subscription!", "toast-info");
    }

    if (day >= 4 && this.sim.clock.hour >= 15 && this.stage === "SUBSCRIPTION") {
      this.processAllotment();
    }

    if (day >= 5 && this.stage === "ALLOTMENT") {
      this.processListing();
    }
  }

  apply(lots) {
    if (this.stage !== "SUBSCRIPTION" && this.stage !== "ANNOUNCEMENT") {
      return { success: false, reason: "IPO Subscription window is closed." };
    }

    const shares = lots * this.lotSize;
    const requiredCash = shares * this.issuePrice;

    if (this.sim.accounting.availableCash < requiredCash) {
      return { success: false, reason: `Insufficient cash. Required: ₹${requiredCash.toLocaleString("en-IN")}` };
    }

    // Reserve funds
    this.sim.accounting.availableCash -= requiredCash;
    this.sim.accounting.reservedCash += requiredCash;

    this.appliedLots = lots;
    this.appliedShares = shares;
    this.reservedCash = requiredCash;

    this.sim.accounting.ledger.push({
      txId: "IPO-BID-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
      time: this.sim.clock.getFormattedTime(),
      type: "IPO BID",
      symbol: "HEXA",
      qty: shares,
      price: this.issuePrice,
      charges: 0,
      netAmount: -requiredCash,
      realisedPnL: 0,
      cashBalance: +(this.sim.accounting.availableCash).toFixed(2)
    });

    return { success: true, shares, requiredCash };
  }

  processAllotment() {
    this.stage = "ALLOTMENT";
    // 80% proportional allotment lottery
    if (this.appliedShares > 0) {
      this.allottedShares = this.appliedShares; // Full educational allotment
      this.sim.accounting.reservedCash -= this.reservedCash;

      // Add to holdings
      this.sim.accounting.holdings["HEXA"] = {
        qty: this.allottedShares,
        avgPrice: this.issuePrice
      };

      this.sim.accounting.ledger.push({
        txId: "IPO-ALLOT-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
        time: this.sim.clock.getFormattedTime(),
        type: "IPO ALLOTMENT",
        symbol: "HEXA",
        qty: this.allottedShares,
        price: this.issuePrice,
        charges: 0,
        netAmount: 0,
        realisedPnL: 0,
        cashBalance: +(this.sim.accounting.availableCash).toFixed(2)
      });

      this.sim.ui.showToast(`🎉 Hexavora IPO Allotment Successful: ${this.allottedShares} shares credited at ₹100.00!`, "toast-success");
    }
  }

  processListing() {
    this.stage = "LISTED";
    const hexa = this.sim.companies.find(c => c.symbol === "HEXA");
    if (hexa) {
      hexa.isIPO = false;
      hexa.ipoStatus = "LISTED";
      // Deterministic listing pop ~ +18% based on strong tech sentiment
      const listingPrice = 118.50;
      hexa.ltp = listingPrice;
      hexa.dayOpen = listingPrice;
      hexa.dayHigh = listingPrice;
      hexa.dayLow = listingPrice;
      this.sim.ui.showToast(`🚀 Hexavora Technologies LISTED at ₹${listingPrice.toFixed(2)} (+18.5% premium)!`, "toast-success");
    }
  }
}

// ============================================================================
// 10. INTERACTIVE CANVAS CANDLESTICK & VOLUME CHART
// ============================================================================

class ChartRenderer {
  constructor(canvasId, sim) {
    this.canvas = document.getElementById(canvasId);
    this.sim = sim;
    this.ctx = this.canvas ? this.canvas.getContext("2d") : null;
    this.candles = {}; // { SYMBOL: [ { time, open, high, low, close, volume } ] }
    this.timeframe = "1m";
    this.chartType = "CANDLES"; // CANDLES or LINE
    this.hoverIndex = -1;

    this.initListeners();
  }

  initListeners() {
    if (!this.canvas) return;
    this.canvas.addEventListener("mousemove", (e) => this.onMouseMove(e));
    this.canvas.addEventListener("mouseleave", () => this.onMouseLeave());
    window.addEventListener("resize", () => this.render());
  }

  addTradeToCandles(symbol, price, qty, timeStr) {
    if (!this.candles[symbol]) this.candles[symbol] = [];
    const list = this.candles[symbol];

    if (list.length === 0) {
      list.push({
        time: timeStr,
        open: price,
        high: price,
        low: price,
        close: price,
        volume: qty
      });
      return;
    }

    const last = list[list.length - 1];
    // Simple bar grouping: 15 ticks per candle
    if (list.length < 50 && (!last.tickCount || last.tickCount < 10)) {
      last.high = Math.max(last.high, price);
      last.low = Math.min(last.low, price);
      last.close = price;
      last.volume += qty;
      last.tickCount = (last.tickCount || 0) + 1;
    } else {
      list.push({
        time: timeStr,
        open: last.close,
        high: Math.max(last.close, price),
        low: Math.min(last.close, price),
        close: price,
        volume: qty,
        tickCount: 1
      });
      if (list.length > 80) list.shift();
    }
  }

  onMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const sym = this.sim.selectedSymbol;
    const data = this.candles[sym] || [];
    if (data.length === 0) return;

    const candleWidth = rect.width / Math.max(15, data.length);
    const idx = Math.floor(mouseX / candleWidth);
    if (idx >= 0 && idx < data.length) {
      this.hoverIndex = idx;
      this.updateHud(data[idx]);
      this.render();
    }
  }

  onMouseLeave() {
    this.hoverIndex = -1;
    const hud = document.getElementById("chartHud");
    if (hud) hud.style.display = "none";
    this.render();
  }

  updateHud(bar) {
    const hud = document.getElementById("chartHud");
    if (!hud) return;
    hud.style.display = "flex";
    document.getElementById("hudOpen").textContent = "₹" + bar.open.toFixed(2);
    document.getElementById("hudHigh").textContent = "₹" + bar.high.toFixed(2);
    document.getElementById("hudLow").textContent = "₹" + bar.low.toFixed(2);
    document.getElementById("hudClose").textContent = "₹" + bar.close.toFixed(2);
    document.getElementById("hudVol").textContent = bar.volume.toLocaleString("en-IN");
  }

  render() {
    if (!this.canvas || !this.ctx) return;
    const canvas = this.canvas;
    const ctx = this.ctx;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = rect.width;
    const height = rect.height;

    ctx.clearRect(0, 0, width, height);

    const sym = this.sim.selectedSymbol;
    const data = this.candles[sym] || [];

    if (data.length === 0) {
      ctx.fillStyle = "#64748b";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Simulating initial market orders...", width / 2, height / 2);
      return;
    }

    // Determine min and max prices
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    let maxVol = 0;

    for (const d of data) {
      if (d.low < minPrice) minPrice = d.low;
      if (d.high > maxPrice) maxPrice = d.high;
      if (d.volume > maxVol) maxVol = d.volume;
    }

    const pricePadding = (maxPrice - minPrice) * 0.1 || 1.0;
    minPrice -= pricePadding;
    maxPrice += pricePadding;

    const chartHeight = height * 0.75;
    const volumeHeight = height * 0.2;
    const candleWidth = width / Math.max(15, data.length);

    // Draw Price Grid Lines
    ctx.strokeStyle = "#1f293d";
    ctx.lineWidth = 1;
    const gridSteps = 4;
    for (let i = 0; i <= gridSteps; i++) {
      const y = chartHeight * (i / gridSteps);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();

      const priceLabel = (maxPrice - (i / gridSteps) * (maxPrice - minPrice)).toFixed(2);
      ctx.fillStyle = "#64748b";
      ctx.font = "9px monospace";
      ctx.textAlign = "right";
      ctx.fillText("₹" + priceLabel, width - 8, y - 3);
    }

    // Draw Candlesticks & Volume Bars
    data.forEach((d, i) => {
      const x = i * candleWidth + candleWidth * 0.5;
      const isGreen = d.close >= d.open;
      const color = isGreen ? "#10b981" : "#ef4444";

      // 1. Volume Bar
      const volH = maxVol > 0 ? (d.volume / maxVol) * volumeHeight : 5;
      const volY = height - volH;
      ctx.fillStyle = isGreen ? "rgba(16, 185, 129, 0.25)" : "rgba(239, 68, 68, 0.25)";
      ctx.fillRect(x - candleWidth * 0.35, volY, candleWidth * 0.7, volH);

      // 2. Candlestick or Line
      if (this.chartType === "CANDLES") {
        const yOpen = chartHeight - ((d.open - minPrice) / (maxPrice - minPrice)) * chartHeight;
        const yClose = chartHeight - ((d.close - minPrice) / (maxPrice - minPrice)) * chartHeight;
        const yHigh = chartHeight - ((d.high - minPrice) / (maxPrice - minPrice)) * chartHeight;
        const yLow = chartHeight - ((d.low - minPrice) / (maxPrice - minPrice)) * chartHeight;

        // Wick
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, yHigh);
        ctx.lineTo(x, yLow);
        ctx.stroke();

        // Body
        ctx.fillStyle = color;
        const bodyY = Math.min(yOpen, yClose);
        const bodyH = Math.max(2, Math.abs(yClose - yOpen));
        ctx.fillRect(x - candleWidth * 0.35, bodyY, candleWidth * 0.7, bodyH);
      }
    });

    // 3. Draw Moving Average MA(10)
    if (data.length > 5) {
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      let started = false;

      for (let i = 0; i < data.length; i++) {
        const period = Math.min(10, i + 1);
        let sum = 0;
        for (let j = i - period + 1; j <= i; j++) {
          sum += data[j].close;
        }
        const ma = sum / period;
        const maX = i * candleWidth + candleWidth * 0.5;
        const maY = chartHeight - ((ma - minPrice) / (maxPrice - minPrice)) * chartHeight;

        if (!started) {
          ctx.moveTo(maX, maY);
          started = true;
        } else {
          ctx.lineTo(maX, maY);
        }
      }
      ctx.stroke();
    }

    // 4. Crosshair Line on Hover
    if (this.hoverIndex >= 0 && this.hoverIndex < data.length) {
      const hoverX = this.hoverIndex * candleWidth + candleWidth * 0.5;
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(hoverX, 0);
      ctx.lineTo(hoverX, height);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }
}

// ============================================================================
// 11. GOOGLE WORKSPACE SYNC & DATA PERSISTENCE
// ============================================================================

class WorkspaceSync {
  constructor(sim) {
    this.sim = sim;
    this.user = null;
    this.accessToken = null;
    this.firebaseApp = null;
    this.auth = null;
    this.initAuth();
  }

  async initAuth() {
    try {
      // Dynamic import of Firebase SDK (bundled by Vite)
      const { initializeApp } = await import("firebase/app");
      const { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } = await import("firebase/auth");
      
      const res = await fetch("./firebase-applet-config.json");
      if (!res.ok) return;
      const firebaseConfig = await res.json();
      
      this.firebaseApp = initializeApp(firebaseConfig);
      this.auth = getAuth(this.firebaseApp);

      onAuthStateChanged(this.auth, (user) => {
        this.user = user;
        this.updateAuthUI();
      });
    } catch (e) {
      console.warn("Firebase Auth initialized in browser fallback mode", e);
    }
  }

  updateAuthUI() {
    const btnSignIn = document.getElementById("btnGoogleSignIn");
    const statusBox = document.getElementById("googleUserStatus");
    const userEmail = document.getElementById("googleUserEmail");

    if (this.user) {
      if (btnSignIn) btnSignIn.style.display = "none";
      if (statusBox) statusBox.style.display = "block";
      if (userEmail) userEmail.textContent = `Signed in as: ${this.user.email || "Trader"}`;
    } else {
      if (btnSignIn) btnSignIn.style.display = "inline-flex";
      if (statusBox) statusBox.style.display = "none";
    }
  }

  async signIn() {
    if (!this.auth) {
      this.sim.ui.showToast("Google Workspace OAuth client is ready.", "toast-info");
      return;
    }
    try {
      const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
      const provider = new GoogleAuthProvider();
      provider.addScope("https://www.googleapis.com/auth/drive.file");
      provider.addScope("https://www.googleapis.com/auth/spreadsheets");

      const result = await signInWithPopup(this.auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      this.accessToken = credential?.accessToken || null;
      this.user = result.user;
      this.updateAuthUI();
      this.sim.ui.showToast(`Signed in with Google as ${this.user.email}`, "toast-success");
    } catch (err) {
      console.error(err);
      this.sim.ui.showToast(`Google Sign-In: ${err.message}`, "toast-error");
    }
  }

  async exportToGoogleSheets() {
    if (!this.accessToken) {
      this.sim.ui.showToast("Please Sign In with Google first to export to Sheets.", "toast-warn");
      // Provide instant CSV download fallback as well
      this.sim.exportCSV();
      return;
    }

    try {
      this.sim.ui.showToast("Creating Google Spreadsheet...", "toast-info");
      // Create new spreadsheet
      const createRes = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          properties: { title: `MarketLab_Trading_Ledger_${Date.now()}` }
        })
      });

      if (!createRes.ok) throw new Error("Failed to create spreadsheet");
      const sheetData = await createRes.json();
      const spreadsheetId = sheetData.spreadsheetId;

      // Prepare rows
      const rows = [
        ["Tx ID", "Timestamp", "Type", "Stock", "Quantity", "Price", "Charges", "Net Amount", "Realised PnL", "Cash Balance"]
      ];

      for (const row of this.sim.accounting.ledger) {
        rows.push([
          row.txId,
          row.time,
          row.type,
          row.symbol,
          row.qty,
          row.price,
          row.charges,
          row.netAmount,
          row.realisedPnL,
          row.cashBalance
        ]);
      }

      // Append values
      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:append?valueInputOption=USER_ENTERED`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ values: rows })
      });

      this.sim.ui.showToast(`✅ Exported to Google Sheet! ID: ${spreadsheetId}`, "toast-success");
    } catch (e) {
      console.error(e);
      this.sim.ui.showToast(`Export error: ${e.message}. Downloading CSV locally instead.`, "toast-warn");
      this.sim.exportCSV();
    }
  }

  async backupToGoogleDrive() {
    if (!this.accessToken) {
      this.sim.ui.showToast("Please Sign In with Google first to backup to Drive.", "toast-warn");
      this.sim.exportJSON();
      return;
    }

    try {
      this.sim.ui.showToast("Uploading backup to Google Drive...", "toast-info");
      const backupData = this.sim.createBackupPayload();
      const fileContent = JSON.stringify(backupData, null, 2);

      const metadata = {
        name: `MarketLab_Backup_${Date.now()}.json`,
        mimeType: "application/json"
      };

      const form = new FormData();
      form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
      form.append("file", new Blob([fileContent], { type: "application/json" }));

      const res = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        },
        body: form
      });

      if (!res.ok) throw new Error("Google Drive upload failed");
      this.sim.ui.showToast("✅ Successfully saved backup to your Google Drive!", "toast-success");
    } catch (e) {
      console.error(e);
      this.sim.ui.showToast(`Drive error: ${e.message}. Exporting local JSON.`, "toast-warn");
      this.sim.exportJSON();
    }
  }
}

// ============================================================================
// 12. UI CONTROLLER & APPLICATION ORCHESTRATION
// ============================================================================

class MarketSimulation {
  constructor() {
    this.companies = COMPANIES.map(c => ({
      ...c,
      ltp: c.basePrice,
      dayOpen: c.basePrice,
      dayHigh: c.basePrice,
      dayLow: c.basePrice,
      dayVolume: 0,
      fairValue: c.basePrice,
      bid: +(c.basePrice * 0.999).toFixed(2),
      ask: +(c.basePrice * 1.001).toFixed(2)
    }));

    this.selectedSymbol = "HEXA";
    this.orderBooks = {};
    for (const c of this.companies) {
      this.orderBooks[c.symbol] = new OrderBook(c.symbol);
    }

    this.clock = new SimulationClock(this);
    this.matchingEngine = new MatchingEngine(this);
    this.accounting = new AccountingLedger(this);
    this.participants = new ParticipantEngine(this);
    this.events = new EventEngine(this);
    this.academy = new AcademyEngine(this);
    this.ipo = new IPOSimulator(this);
    this.workspaceSync = new WorkspaceSync(this);
    this.journal = [];

    this.chart = new ChartRenderer("marketChart", this);
    this.ui = new UIController(this);
  }

  init() {
    this.loadState();
    this.clock.start();
    this.ui.init();

    // Populate initial order book bids and asks
    for (const c of this.companies) {
      const book = this.orderBooks[c.symbol];
      for (let i = 1; i <= 5; i++) {
        book.addOrder({
          id: `INIT-B-${c.symbol}-${i}`,
          price: +(c.basePrice * (1 - i * 0.002)).toFixed(2),
          qty: 25 * i,
          timestamp: Date.now() - 10000,
          isUser: false,
          side: "BUY"
        });
        book.addOrder({
          id: `INIT-A-${c.symbol}-${i}`,
          price: +(c.basePrice * (1 + i * 0.002)).toFixed(2),
          qty: 20 * i,
          timestamp: Date.now() - 10000,
          isUser: false,
          side: "SELL"
        });
      }
      this.chart.addTradeToCandles(c.symbol, c.basePrice, 100, this.clock.getFormattedTime());
    }

    this.ui.renderAll();
    this.ui.showToast("Welcome to MarketLab! Virtual Capital: ₹10,000.00. Simulated Market is OPEN.", "toast-info");
  }

  onClockTick() {
    this.participants.tick();
    this.events.tick();
    this.ipo.tick();
    this.ui.updateClockDisplay();
    this.ui.updateIndexDisplay();
    this.saveState();
  }

  onSessionClose() {
    this.ui.showToast(`Trading Session Day ${this.clock.day} CLOSED at 15:30 IST. Daily reports compiled.`, "toast-warn");
    this.accounting.dailyEquitySnapshots.push({
      day: this.clock.day,
      equity: this.accounting.getTotalEquity()
    });
    this.saveState();
    this.ui.renderAll();
  }

  onNewDayStart() {
    this.ui.showToast(`Market Opening Bell! Welcome to Day ${this.clock.day} of simulated trading.`, "toast-info");
    for (const c of this.companies) {
      c.dayOpen = c.ltp;
      c.dayHigh = c.ltp;
      c.dayLow = c.ltp;
      c.dayVolume = 0;
    }
    this.ui.renderAll();
  }

  onRegimeChange(newRegime) {
    const el = document.getElementById("marketRegime");
    if (el) {
      el.textContent = newRegime;
      el.style.color = newRegime === "BULLISH" ? "var(--color-green)" : (newRegime === "BEARISH" ? "var(--color-red)" : "var(--color-amber)");
    }
  }

  updateCompanyPrice(symbol, price, qty, trade) {
    const c = this.companies.find(x => x.symbol === symbol);
    if (!c) return;
    c.ltp = price;
    c.dayVolume += qty;
    if (price > c.dayHigh) c.dayHigh = price;
    if (price < c.dayLow) c.dayLow = price;

    const book = this.orderBooks[symbol];
    c.bid = book.getBestBid() || +(price * 0.999).toFixed(2);
    c.ask = book.getBestAsk() || +(price * 1.001).toFixed(2);

    this.chart.addTradeToCandles(symbol, price, qty, trade.timeString);

    if (symbol === this.selectedSymbol) {
      this.ui.renderSelectedStock();
      this.ui.renderOrderBook();
      this.chart.render();
    }
  }

  selectStock(symbol) {
    this.selectedSymbol = symbol;
    this.ui.renderSelectedStock();
    this.ui.renderOrderBook();
    this.chart.render();
  }

  journalTrade({ time, tag, stock, summary, note }) {
    this.journal.unshift({ time, tag, stock, summary, note });
    if (this.journal.length > 50) this.journal.pop();
    this.ui.renderJournal();
  }

  createBackupPayload() {
    return {
      version: "marketlab-v1",
      exportedAt: new Date().toISOString(),
      availableCash: this.accounting.availableCash,
      reservedCash: this.accounting.reservedCash,
      holdings: this.accounting.holdings,
      orders: this.accounting.orders,
      ledger: this.accounting.ledger,
      journal: this.journal,
      day: this.clock.day,
      unlockedLevel: this.academy.unlockedLevel,
      completedLevels: this.academy.completedLevels
    };
  }

  saveState() {
    try {
      const payload = this.createBackupPayload();
      localStorage.setItem("marketlab_state", JSON.stringify(payload));
    } catch (e) {
      // Storage quota or privacy restriction
    }
  }

  loadState() {
    try {
      const raw = localStorage.getItem("marketlab_state");
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data && data.version === "marketlab-v1") {
        this.accounting.availableCash = data.availableCash ?? 10000.0;
        this.accounting.reservedCash = data.reservedCash ?? 0.0;
        this.accounting.holdings = data.holdings ?? {};
        this.accounting.orders = data.orders ?? [];
        this.accounting.openOrders = (data.orders ?? []).filter(o => o.status === "OPEN" || o.status === "PARTIAL");
        this.accounting.ledger = data.ledger ?? [];
        this.journal = data.journal ?? [];
        this.clock.day = data.day ?? 1;
        this.academy.unlockedLevel = data.unlockedLevel ?? 1;
        this.academy.completedLevels = data.completedLevels ?? [];
      }
    } catch (e) {
      console.warn("Could not parse saved state", e);
    }
  }

  resetAccount() {
    localStorage.removeItem("marketlab_state");
    this.accounting.availableCash = 10000.0;
    this.accounting.reservedCash = 0.0;
    this.accounting.holdings = {};
    this.accounting.orders = [];
    this.accounting.openOrders = [];
    this.accounting.ledger = [];
    this.accounting.realisedPnL = 0.0;
    this.accounting.totalFeesPaid = 0.0;
    this.clock.day = 1;
    this.clock.hour = 9;
    this.clock.minute = 15;
    this.academy.unlockedLevel = 1;
    this.academy.completedLevels = [];
    this.ui.renderAll();
    this.ui.showToast("Account reset! Virtual cash set to ₹10,000.00.", "toast-info");
  }

  exportCSV() {
    const headers = ["Tx ID,Timestamp,Type,Stock,Quantity,Price,Charges,Net Amount,Realised PnL,Cash Balance\n"];
    const rows = this.accounting.ledger.map(r => 
      `"${r.txId}","${r.time}","${r.type}","${r.symbol}",${r.qty},${r.price},${r.charges},${r.netAmount},${r.realisedPnL},${r.cashBalance}`
    );
    const blob = new Blob([headers.concat(rows.join("\n"))], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MarketLab_Ledger_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  exportJSON() {
    const data = this.createBackupPayload();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MarketLab_Backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

class UIController {
  constructor(sim) {
    this.sim = sim;
    this.activeTab = "tab-holdings";
    this.selectedSector = "ALL";
    this.searchQuery = "";
    this.orderSide = "BUY";
    this.orderType = "MARKET";
  }

  init() {
    this.bindControls();
    this.renderWatchlist();
    this.renderSelectedStock();
    this.renderAcademy();
  }

  bindControls() {
    // Theme Switcher
    const btnTheme = document.getElementById("btnThemeToggle");
    if (btnTheme) {
      btnTheme.addEventListener("click", () => {
        document.body.classList.toggle("light-theme");
        btnTheme.textContent = document.body.classList.contains("light-theme") ? "☀️" : "🌙";
        this.sim.chart.render();
      });
    }

    // Simulation Clock Controls
    const btnPlayPause = document.getElementById("btnPlayPause");
    if (btnPlayPause) {
      btnPlayPause.addEventListener("click", () => {
        const isPaused = this.sim.clock.togglePause();
        btnPlayPause.textContent = isPaused ? "▶ Resume" : "⏸ Pause";
        document.getElementById("clockDot").className = `clock-status-dot ${isPaused ? "paused" : "open"}`;
        document.getElementById("marketStatusTag").className = `clock-status-tag ${isPaused ? "paused" : "open"}`;
        document.getElementById("marketStatusTag").textContent = isPaused ? "PAUSED" : "OPEN";
      });
    }

    const speeds = [1, 2, 5, 10];
    speeds.forEach(s => {
      const btn = document.getElementById(`btnSpeed${s}x`);
      if (btn) {
        btn.addEventListener("click", () => {
          speeds.forEach(other => document.getElementById(`btnSpeed${other}x`)?.classList.remove("active"));
          btn.classList.add("active");
          this.sim.clock.setSpeed(s);
        });
      }
    });

    const btnNextSession = document.getElementById("btnNextSession");
    if (btnNextSession) {
      btnNextSession.addEventListener("click", () => this.sim.clock.nextDay());
    }

    // Watchlist Search & Sector Filter
    const searchInput = document.getElementById("watchlistSearch");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.toLowerCase();
        this.renderWatchlist();
      });
    }

    const filterChips = document.querySelectorAll(".filter-chip");
    filterChips.forEach(chip => {
      chip.addEventListener("click", () => {
        filterChips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        this.selectedSector = chip.getAttribute("data-sector");
        this.renderWatchlist();
      });
    });

    // Lower Workspace Tabs
    const tabButtons = document.querySelectorAll(".tab-btn");
    tabButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-tab");
        tabButtons.forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
        btn.classList.add("active");
        document.getElementById(target)?.classList.add("active");
        this.activeTab = target;
        if (target === "tab-analytics") this.renderAnalyticsCanvas();
      });
    });

    // Chart Timeframe & Type
    const tfButtons = document.querySelectorAll("[data-tf]");
    tfButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        tfButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.sim.chart.timeframe = btn.getAttribute("data-tf");
        this.sim.chart.render();
      });
    });

    document.getElementById("btnChartCandles")?.addEventListener("click", (e) => {
      e.target.classList.add("active");
      document.getElementById("btnChartLine")?.classList.remove("active");
      this.sim.chart.chartType = "CANDLES";
      this.sim.chart.render();
    });

    document.getElementById("btnChartLine")?.addEventListener("click", (e) => {
      e.target.classList.add("active");
      document.getElementById("btnChartCandles")?.classList.remove("active");
      this.sim.chart.chartType = "LINE";
      this.sim.chart.render();
    });

    // Order Ticket Controls
    document.getElementById("tabOrderBuy")?.addEventListener("click", () => this.setOrderSide("BUY"));
    document.getElementById("tabOrderSell")?.addEventListener("click", () => this.setOrderSide("SELL"));
    document.getElementById("tabOrderMarket")?.addEventListener("click", () => this.setOrderType("MARKET"));
    document.getElementById("tabOrderLimit")?.addEventListener("click", () => this.setOrderType("LIMIT"));

    document.getElementById("ticketQty")?.addEventListener("input", () => this.updateTicketEstimates());
    document.getElementById("ticketPrice")?.addEventListener("input", () => this.updateTicketEstimates());

    document.getElementById("btnPlaceOrder")?.addEventListener("click", () => this.handlePlaceOrder());

    // Trading Journal Add
    document.getElementById("btnAddJournalNote")?.addEventListener("click", () => {
      const input = document.getElementById("journalNoteInput");
      const tag = document.getElementById("journalTagSelect")?.value || "Note";
      if (input && input.value.trim()) {
        this.sim.journalTrade({
          time: this.sim.clock.getFormattedTime(),
          tag,
          stock: this.sim.selectedSymbol,
          summary: "Manual Observation",
          note: input.value.trim()
        });
        input.value = "";
        this.showToast("Journal note recorded.", "toast-success");
      }
    });

    // Backup & Export Controls
    document.getElementById("btnExportCSV")?.addEventListener("click", () => this.sim.exportCSV());
    document.getElementById("btnDownloadJSON")?.addEventListener("click", () => this.sim.exportJSON());
    document.getElementById("btnResetAccount")?.addEventListener("click", () => {
      if (confirm("Reset virtual account to ₹10,000.00? This clears your simulation history.")) {
        this.sim.resetAccount();
      }
    });

    // Google Workspace buttons
    document.getElementById("btnGoogleSignIn")?.addEventListener("click", () => this.sim.workspaceSync.signIn());
    document.getElementById("btnGoogleSignOut")?.addEventListener("click", async () => {
      if (this.sim.workspaceSync.auth) {
        const { signOut } = await import("firebase/auth");
        await signOut(this.sim.workspaceSync.auth);
        this.sim.workspaceSync.user = null;
        this.sim.workspaceSync.accessToken = null;
        this.sim.workspaceSync.updateAuthUI();
      }
    });
    document.getElementById("btnGoogleSyncQuick")?.addEventListener("click", () => {
      document.querySelector('[data-tab="tab-sync"]')?.click();
    });
    document.getElementById("btnSyncGoogleSheets")?.addEventListener("click", () => this.sim.workspaceSync.exportToGoogleSheets());
    document.getElementById("btnExportSheetsQuick")?.addEventListener("click", () => this.sim.workspaceSync.exportToGoogleSheets());
    document.getElementById("btnSyncGoogleDrive")?.addEventListener("click", () => this.sim.workspaceSync.backupToGoogleDrive());

    // IPO Application
    document.getElementById("btnApplyIPO")?.addEventListener("click", () => {
      const lots = parseInt(document.getElementById("ipoLotsSelect")?.value || "1", 10);
      const res = this.sim.ipo.apply(lots);
      if (res.success) {
        this.showToast(`Applied for ${res.shares} shares of Hexavora IPO (₹${res.requiredCash.toLocaleString("en-IN")} reserved).`, "toast-success");
        document.getElementById("ipoApplicationStatusText").textContent = `Applied (${res.shares} shares pending allotment)`;
        document.getElementById("ipoApplicationStatusText").style.color = "var(--color-green)";
        this.renderAll();
      } else {
        this.showToast(res.reason, "toast-error");
      }
    });

    // Lesson Modal Close
    document.getElementById("btnCloseLessonModal")?.addEventListener("click", () => this.closeLessonModal());
    document.getElementById("btnCancelLesson")?.addEventListener("click", () => this.closeLessonModal());
  }

  setOrderSide(side) {
    this.orderSide = side;
    document.getElementById("tabOrderBuy")?.classList.toggle("active", side === "BUY");
    document.getElementById("tabOrderSell")?.classList.toggle("active", side === "SELL");
    const btn = document.getElementById("btnPlaceOrder");
    if (btn) {
      btn.className = `btn-place-order ${side.toLowerCase()}`;
      btn.textContent = `${side} ${document.getElementById("ticketQty")?.value || 1} SHS`;
    }
    this.updateTicketEstimates();
  }

  setOrderType(type) {
    this.orderType = type;
    document.getElementById("tabOrderMarket")?.classList.toggle("active", type === "MARKET");
    document.getElementById("tabOrderLimit")?.classList.toggle("active", type === "LIMIT");
    const priceGroup = document.getElementById("ticketPriceGroup");
    const priceInput = document.getElementById("ticketPrice");
    if (priceGroup && priceInput) {
      if (type === "MARKET") {
        priceGroup.style.opacity = "0.5";
        priceInput.disabled = true;
      } else {
        priceGroup.style.opacity = "1";
        priceInput.disabled = false;
      }
    }
    this.updateTicketEstimates();
  }

  updateTicketEstimates() {
    const qty = parseInt(document.getElementById("ticketQty")?.value || "0", 10);
    const comp = this.sim.companies.find(c => c.symbol === this.sim.selectedSymbol);
    if (!comp) return;

    const currentLtp = comp.ltp || comp.basePrice;
    document.getElementById("ticketLtpRef").textContent = "₹" + currentLtp.toFixed(2);

    let price = currentLtp;
    if (this.orderType === "LIMIT") {
      price = parseFloat(document.getElementById("ticketPrice")?.value || currentLtp.toString());
    }

    const gross = +(qty * price).toFixed(2);
    const charges = this.sim.accounting.calculateCharges(gross);
    const total = this.orderSide === "BUY" ? +(gross + charges.total).toFixed(2) : +(gross - charges.total).toFixed(2);

    document.getElementById("ticketGrossVal").textContent = "₹" + gross.toLocaleString("en-IN", { minimumFractionDigits: 2 });
    document.getElementById("ticketChargesVal").textContent = "₹" + charges.total.toFixed(2);
    document.getElementById("ticketTotalVal").textContent = "₹" + total.toLocaleString("en-IN", { minimumFractionDigits: 2 });
    document.getElementById("ticketAvailCash").textContent = "₹" + this.sim.accounting.availableCash.toLocaleString("en-IN", { minimumFractionDigits: 2 });

    const btn = document.getElementById("btnPlaceOrder");
    if (btn) btn.textContent = `${this.orderSide} ${qty} SHS`;
  }

  handlePlaceOrder() {
    const qty = parseInt(document.getElementById("ticketQty")?.value || "0", 10);
    let price = 0;
    if (this.orderType === "LIMIT") {
      price = parseFloat(document.getElementById("ticketPrice")?.value || "0");
    }

    const res = this.sim.accounting.placeOrder({
      symbol: this.sim.selectedSymbol,
      side: this.orderSide,
      type: this.orderType,
      qty,
      price
    });

    if (res.success) {
      this.showToast(`Order Placed: ${this.orderSide} ${qty} ${this.sim.selectedSymbol} (${this.orderType})`, "toast-success");
      this.renderAll();
    } else {
      this.showToast(res.reason, "toast-error");
    }
  }

  renderAll() {
    this.updateHeaderPills();
    this.renderWatchlist();
    this.renderSelectedStock();
    this.renderHoldingsTable();
    this.renderOrdersTable();
    this.renderLedgerTable();
    this.renderJournal();
    this.renderOrderBook();
    this.renderAnalyticsKPIs();
    this.updateTicketEstimates();
  }

  updateHeaderPills() {
    const equity = this.sim.accounting.getTotalEquity();
    const cash = this.sim.accounting.availableCash;
    document.getElementById("headerEquity").textContent = "₹" + equity.toLocaleString("en-IN", { minimumFractionDigits: 2 });
    document.getElementById("headerCash").textContent = "₹" + cash.toLocaleString("en-IN", { minimumFractionDigits: 2 });
    document.getElementById("headerAcademyLevel").textContent = `Lvl ${this.sim.academy.unlockedLevel}`;
  }

  updateClockDisplay() {
    document.getElementById("clockDisplay").textContent = this.sim.clock.getFormattedTime();
  }

  updateIndexDisplay() {
    // Simulated Hexa-50 Index calculated from top 10 stocks
    let indexSum = 0;
    let baseSum = 0;
    let advances = 0;
    let declines = 0;
    let unchanged = 0;
    let totalVol = 0;

    for (const c of this.sim.companies) {
      indexSum += (c.ltp || c.basePrice);
      baseSum += c.basePrice;
      totalVol += (c.dayVolume || 0);

      const change = (c.ltp || c.basePrice) - c.dayOpen;
      if (change > 0.05) advances++;
      else if (change < -0.05) declines++;
      else unchanged++;
    }

    const indexVal = +(22400 * (indexSum / baseSum)).toFixed(2);
    const indexChg = +(indexVal - 22400).toFixed(2);
    const indexPct = +((indexChg / 22400) * 100).toFixed(2);

    const valEl = document.getElementById("indexValue");
    const chgEl = document.getElementById("indexChange");
    if (valEl) valEl.textContent = indexVal.toLocaleString("en-IN", { minimumFractionDigits: 2 });
    if (chgEl) {
      chgEl.className = `index-change num ${indexChg >= 0 ? "text-green" : "text-red"}`;
      chgEl.textContent = `${indexChg >= 0 ? "+" : ""}${indexChg.toFixed(2)} (${indexPct >= 0 ? "+" : ""}${indexPct.toFixed(2)}%)`;
    }

    document.getElementById("marketBreadth").textContent = `▲ ${advances}  ▼ ${declines}  ➖ ${unchanged}`;
    document.getElementById("marketVolume").textContent = totalVol.toLocaleString("en-IN") + " shs";
  }

  renderWatchlist() {
    const list = document.getElementById("watchlistContainer");
    if (!list) return;

    const filtered = this.sim.companies.filter(c => {
      const matchSector = this.selectedSector === "ALL" || c.sector === this.selectedSector;
      const matchSearch = c.symbol.toLowerCase().includes(this.searchQuery) || c.name.toLowerCase().includes(this.searchQuery);
      return matchSector && matchSearch;
    });

    list.innerHTML = filtered.map(c => {
      const ltp = c.ltp || c.basePrice;
      const chg = ltp - c.dayOpen;
      const chgPct = c.dayOpen > 0 ? (chg / c.dayOpen) * 100 : 0;
      const isSelected = c.symbol === this.sim.selectedSymbol;
      const isUp = chg >= 0;

      return `
        <li class="stock-item ${isSelected ? "selected" : ""}" data-symbol="${c.symbol}">
          <div class="stock-info-left">
            <div class="stock-ticker-name">
              <span class="stock-ticker">${c.symbol}</span>
              ${c.isIPO ? `<span class="stock-badge-ipo">IPO</span>` : ""}
            </div>
            <span class="stock-company-name">${c.name}</span>
            <span class="stock-sector-tag">${c.sector}</span>
          </div>
          <div class="stock-info-right">
            <span class="stock-price num">₹${ltp.toFixed(2)}</span>
            <span class="stock-change num ${isUp ? "text-green" : "text-red"}">
              ${isUp ? "+" : ""}${chg.toFixed(2)} (${isUp ? "+" : ""}${chgPct.toFixed(2)}%)
            </span>
          </div>
        </li>
      `;
    }).join("");

    list.querySelectorAll(".stock-item").forEach(item => {
      item.addEventListener("click", () => {
        const sym = item.getAttribute("data-symbol");
        this.sim.selectStock(sym);
      });
    });
  }

  renderSelectedStock() {
    const c = this.sim.companies.find(x => x.symbol === this.sim.selectedSymbol);
    if (!c) return;

    const ltp = c.ltp || c.basePrice;
    const chg = ltp - c.dayOpen;
    const chgPct = c.dayOpen > 0 ? (chg / c.dayOpen) * 100 : 0;
    const isUp = chg >= 0;

    document.getElementById("stkHeaderSymbol").textContent = c.symbol;
    document.getElementById("stkHeaderName").textContent = c.name;
    document.getElementById("stkHeaderSector").textContent = `${c.sector} • ${c.subsector}`;

    const priceEl = document.getElementById("stkHeaderPrice");
    priceEl.textContent = "₹" + ltp.toFixed(2);
    priceEl.className = `stk-stat-val num ${isUp ? "text-green" : "text-red"}`;

    const chgEl = document.getElementById("stkHeaderChange");
    chgEl.textContent = `${isUp ? "+" : ""}${chg.toFixed(2)} (${isUp ? "+" : ""}${chgPct.toFixed(2)}%)`;
    chgEl.className = `stk-stat-val num ${isUp ? "text-green" : "text-red"}`;

    document.getElementById("stkHeaderRange").textContent = `₹${c.dayLow.toFixed(2)} - ₹${c.dayHigh.toFixed(2)}`;
    document.getElementById("stkHeaderVolume").textContent = (c.dayVolume || 0).toLocaleString("en-IN");
    document.getElementById("stkHeaderPE").textContent = c.pe.toFixed(1);

    const priceInput = document.getElementById("ticketPrice");
    if (priceInput && this.orderType !== "LIMIT") {
      priceInput.value = ltp.toFixed(2);
    }
  }

  renderOrderBook() {
    const book = this.sim.orderBooks[this.sim.selectedSymbol];
    if (!book) return;

    const depth = book.getDepth(5);
    const bidsEl = document.getElementById("orderbookBidsList");
    const asksEl = document.getElementById("orderbookAsksList");

    let totalBidQty = 0;
    let totalAskQty = 0;

    if (bidsEl) {
      bidsEl.innerHTML = depth.bids.map(b => {
        totalBidQty += b.qty;
        return `
          <div class="book-row">
            <div class="depth-bar bid" style="width: ${Math.min(100, b.qty * 1.5)}%;"></div>
            <span class="num">${b.qty}</span>
            <span class="num text-green">₹${b.price.toFixed(2)}</span>
          </div>
        `;
      }).join("") || `<div style="color: var(--text-muted); padding: 4px;">No resting bids</div>`;
    }

    if (asksEl) {
      asksEl.innerHTML = depth.asks.map(a => {
        totalAskQty += a.qty;
        return `
          <div class="book-row">
            <div class="depth-bar ask" style="width: ${Math.min(100, a.qty * 1.5)}%;"></div>
            <span class="num text-red">₹${a.price.toFixed(2)}</span>
            <span class="num">${a.qty}</span>
          </div>
        `;
      }).join("") || `<div style="color: var(--text-muted); padding: 4px;">No resting asks</div>`;
    }

    const spread = book.getSpread();
    const spreadPct = ((spread / (book.getBestBid() || 100)) * 100).toFixed(2);
    document.getElementById("orderbookSpread").textContent = 
      `Spread: ₹${spread.toFixed(2)} (${spreadPct}%) • Bid Vol: ${totalBidQty} • Ask Vol: ${totalAskQty}`;
  }

  renderHoldingsTable() {
    const tbody = document.getElementById("holdingsTableBody");
    const empty = document.getElementById("emptyHoldings");
    const badge = document.getElementById("badgeHoldings");
    if (!tbody) return;

    const holdings = this.sim.accounting.holdings;
    const symbols = Object.keys(holdings);

    if (badge) badge.textContent = symbols.length.toString();

    if (symbols.length === 0) {
      tbody.innerHTML = "";
      if (empty) empty.style.display = "flex";
      return;
    }

    if (empty) empty.style.display = "none";

    tbody.innerHTML = symbols.map(sym => {
      const h = holdings[sym];
      const comp = this.sim.companies.find(c => c.symbol === sym);
      const ltp = comp ? (comp.ltp || comp.basePrice) : h.avgPrice;
      const curVal = +(h.qty * ltp).toFixed(2);
      const pnl = +(curVal - (h.qty * h.avgPrice)).toFixed(2);
      const pnlPct = +((pnl / (h.qty * h.avgPrice)) * 100).toFixed(2);
      const isUp = pnl >= 0;

      return `
        <tr>
          <td><b>${sym}</b></td>
          <td class="num">${h.qty}</td>
          <td class="num">₹${h.avgPrice.toFixed(2)}</td>
          <td class="num">₹${ltp.toFixed(2)}</td>
          <td class="num">₹${curVal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
          <td class="num ${isUp ? "text-green" : "text-red"}">${isUp ? "+" : ""}₹${pnl.toFixed(2)}</td>
          <td class="num ${isUp ? "text-green" : "text-red"}">${isUp ? "+" : ""}${pnlPct.toFixed(2)}%</td>
          <td>
            <button class="btn-table-action btn-sell-holding" data-symbol="${sym}" data-qty="${h.qty}">Sell All</button>
          </td>
        </tr>
      `;
    }).join("");

    tbody.querySelectorAll(".btn-sell-holding").forEach(btn => {
      btn.addEventListener("click", () => {
        const sym = btn.getAttribute("data-symbol");
        const qty = parseInt(btn.getAttribute("data-qty"), 10);
        this.sim.selectStock(sym);
        this.setOrderSide("SELL");
        document.getElementById("ticketQty").value = qty;
        this.handlePlaceOrder();
      });
    });
  }

  renderOrdersTable() {
    const tbody = document.getElementById("openOrdersTableBody");
    const empty = document.getElementById("emptyOrders");
    const badge = document.getElementById("badgeOrders");
    if (!tbody) return;

    const open = this.sim.accounting.openOrders;
    if (badge) badge.textContent = open.length.toString();

    if (open.length === 0) {
      tbody.innerHTML = "";
      if (empty) empty.style.display = "flex";
      return;
    }

    if (empty) empty.style.display = "none";

    tbody.innerHTML = open.map(o => `
      <tr>
        <td class="num">${o.id}</td>
        <td>${o.timeString}</td>
        <td><b>${o.symbol}</b></td>
        <td class="${o.side === "BUY" ? "text-green" : "text-red"}"><b>${o.side}</b></td>
        <td>${o.type}</td>
        <td class="num">${o.type === "LIMIT" ? "₹" + o.price.toFixed(2) : "MKT"}</td>
        <td class="num">${o.qty}</td>
        <td class="num">${o.filledQty}</td>
        <td><span class="clock-status-tag ${o.status === "OPEN" ? "open" : "paused"}">${o.status}</span></td>
        <td>
          <button class="btn-table-action btn-cancel-order" data-id="${o.id}">Cancel</button>
        </td>
      </tr>
    `).join("");

    tbody.querySelectorAll(".btn-cancel-order").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        this.sim.accounting.cancelOrder(id);
      });
    });

    // Also populate Order History
    const histBody = document.getElementById("orderHistoryTableBody");
    if (histBody) {
      histBody.innerHTML = this.sim.accounting.orders.slice().reverse().map(o => `
        <tr>
          <td class="num">${o.id}</td>
          <td>${o.timeString}</td>
          <td><b>${o.symbol}</b></td>
          <td class="${o.side === "BUY" ? "text-green" : "text-red"}"><b>${o.side}</b></td>
          <td>${o.type}</td>
          <td class="num">${o.price > 0 ? "₹" + o.price.toFixed(2) : "MKT"}</td>
          <td class="num">${o.qty}</td>
          <td class="num">${o.filledQty}</td>
          <td><span class="clock-status-tag ${o.status === "FILLED" ? "open" : (o.status === "CANCELLED" ? "closed" : "paused")}">${o.status}</span></td>
        </tr>
      `).join("");
    }
  }

  renderLedgerTable() {
    const tbody = document.getElementById("ledgerTableBody");
    if (!tbody) return;

    tbody.innerHTML = this.sim.accounting.ledger.slice().reverse().map(l => `
      <tr>
        <td class="num">${l.txId}</td>
        <td>${l.time}</td>
        <td><b>${l.type}</b></td>
        <td><b>${l.symbol}</b></td>
        <td class="num">${l.qty}</td>
        <td class="num">₹${l.price.toFixed(2)}</td>
        <td class="num">₹${l.charges.toFixed(2)}</td>
        <td class="num ${l.netAmount >= 0 ? "text-green" : "text-red"}">₹${l.netAmount.toFixed(2)}</td>
        <td class="num ${l.realisedPnL >= 0 ? "text-green" : "text-red"}">${l.realisedPnL !== 0 ? "₹" + l.realisedPnL.toFixed(2) : "-"}</td>
        <td class="num">₹${l.cashBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
      </tr>
    `).join("");
  }

  renderJournal() {
    const tbody = document.getElementById("journalTableBody");
    if (!tbody) return;

    tbody.innerHTML = this.sim.journal.map(j => `
      <tr>
        <td>${j.time}</td>
        <td><span class="tab-badge">${j.tag}</span></td>
        <td><b>${j.stock}</b></td>
        <td>${j.summary}</td>
        <td>${j.note}</td>
      </tr>
    `).join("");
  }

  renderAnalyticsKPIs() {
    const eq = this.sim.accounting.getTotalEquity();
    const ret = +(((eq - 10000) / 10000) * 100).toFixed(2);
    const realised = this.sim.accounting.realisedPnL;
    const unrealised = this.sim.accounting.getUnrealisedPnL();
    const fees = this.sim.accounting.totalFeesPaid;

    const closedSells = this.sim.accounting.ledger.filter(l => l.type === "SELL");
    const winTrades = closedSells.filter(l => l.realisedPnL > 0).length;
    const winRate = closedSells.length > 0 ? +((winTrades / closedSells.length) * 100).toFixed(1) : 0;

    document.getElementById("kpiEquity").textContent = "₹" + eq.toLocaleString("en-IN", { minimumFractionDigits: 2 });
    document.getElementById("kpiNetReturn").textContent = `${ret >= 0 ? "+" : ""}${ret.toFixed(2)}% Net Return`;
    document.getElementById("kpiRealisedPnL").textContent = "₹" + realised.toFixed(2);
    document.getElementById("kpiUnrealisedPnL").textContent = "₹" + unrealised.toFixed(2);
    document.getElementById("kpiWinRate").textContent = `${winRate}%`;
    document.getElementById("kpiTradeCount").textContent = `${closedSells.length} closed trades`;
    document.getElementById("kpiCharges").textContent = "₹" + fees.toFixed(2);
  }

  renderAnalyticsCanvas() {
    const canvas = document.getElementById("equityCurveCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = rect.width;
    const height = rect.height;

    ctx.clearRect(0, 0, width, height);

    const snaps = this.sim.accounting.dailyEquitySnapshots;
    if (snaps.length === 0) return;

    let min = Infinity;
    let max = -Infinity;
    for (const s of snaps) {
      if (s.equity < min) min = s.equity;
      if (s.equity > max) max = s.equity;
    }
    min = Math.min(min, 9500);
    max = Math.max(max, 10500);

    // Draw baseline ₹10,000
    const baseY = height - ((10000 - min) / (max - min)) * height;
    ctx.strokeStyle = "#334155";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, baseY);
    ctx.lineTo(width, baseY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw equity curve
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    snaps.forEach((s, i) => {
      const x = (i / Math.max(1, snaps.length - 1)) * width;
      const y = height - ((s.equity - min) / (max - min)) * height;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }

  renderAcademy() {
    const container = document.getElementById("academyCardsContainer");
    if (!container) return;

    container.innerHTML = ACADEMY_LEVELS.map(lvl => {
      const isCompleted = this.sim.academy.completedLevels.includes(lvl.id);
      const isUnlocked = lvl.id <= this.sim.academy.unlockedLevel;
      const statusClass = isCompleted ? "completed" : (isUnlocked ? "unlocked" : "locked");

      return `
        <div class="academy-card ${statusClass}">
          <div class="card-level-tag">
            <span>LEVEL ${lvl.id}</span>
            <span>${isCompleted ? "✅ PASSED" : (isUnlocked ? "🔓 UNLOCKED" : "🔒 LOCKED")}</span>
          </div>
          <div class="card-level-title">${lvl.title}</div>
          <div class="card-level-desc">${lvl.desc}</div>
          <div class="card-criteria-box">
            <div><b>Challenge:</b> ${lvl.challenge}</div>
            <div class="card-criteria-item">
              <span>Prerequisite:</span>
              <span>${lvl.prereqText}</span>
            </div>
          </div>
          <button class="btn-open-lesson" data-level="${lvl.id}" ${isUnlocked ? "" : "disabled"}>
            ${isCompleted ? "Review Lesson & Quiz" : (isUnlocked ? "Start Lesson & Assessment" : "Locked (Complete Prior Level)")}
          </button>
        </div>
      `;
    }).join("");

    container.querySelectorAll(".btn-open-lesson").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.getAttribute("data-level"), 10);
        this.openLessonModal(id);
      });
    });
  }

  openLessonModal(levelId) {
    const lvl = ACADEMY_LEVELS.find(l => l.id === levelId);
    if (!lvl) return;

    document.getElementById("modalLessonTitle").textContent = `Level ${lvl.id} — ${lvl.title}`;
    const body = document.getElementById("modalLessonBody");

    body.innerHTML = `
      <div style="background: var(--bg-card); padding: 12px; border-radius: 6px; margin-bottom: 12px;">
        <h4 style="color: var(--text-primary); margin-bottom: 6px;">Core Concept & Theory</h4>
        <p style="color: var(--text-secondary); line-height: 1.5;">${lvl.desc}</p>
        <div style="margin-top: 8px; font-size: 11px; color: var(--accent-cyan);">
          <b>Educational Directive:</b> Markets are governed by double-auction order matching. Price changes reflect liquidity absorption rather than random fluctuations.
        </div>
      </div>

      <h4 style="color: var(--text-primary); margin-bottom: 8px;">Knowledge Assessment Quiz</h4>
      ${lvl.quiz.map((qItem, qIdx) => `
        <div style="background: var(--bg-tertiary); padding: 10px; border-radius: 6px; margin-bottom: 10px;">
          <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 6px;">Q${qIdx + 1}. ${qItem.q}</div>
          ${qItem.opts.map((opt, optIdx) => `
            <label style="display: flex; align-items: baseline; gap: 6px; margin-bottom: 4px; cursor: pointer;">
              <input type="radio" name="quiz_q_${qIdx}" value="${optIdx}" />
              <span>${opt}</span>
            </label>
          `).join("")}
        </div>
      `).join("")}
    `;

    document.getElementById("btnSubmitQuiz").onclick = () => {
      // Validate quiz answers
      let allCorrect = true;
      lvl.quiz.forEach((qItem, qIdx) => {
        const selected = document.querySelector(`input[name="quiz_q_${qIdx}"]:checked`);
        if (!selected || parseInt(selected.value, 10) !== qItem.ans) {
          allCorrect = false;
        }
      });

      if (allCorrect) {
        this.showToast(`🎉 Quiz Passed with 100%! Risk and knowledge criteria validated.`, "toast-success");
        if (!this.sim.academy.completedLevels.includes(lvl.id)) {
          this.sim.academy.completedLevels.push(lvl.id);
          this.sim.academy.unlockedLevel = Math.max(this.sim.academy.unlockedLevel, lvl.id + 1);
        }
        this.closeLessonModal();
        this.renderAcademy();
      } else {
        this.showToast("Some quiz answers were incorrect. Review the concepts and retry.", "toast-warn");
      }
    };

    document.getElementById("lessonModal")?.classList.add("active");
  }

  closeLessonModal() {
    document.getElementById("lessonModal")?.classList.remove("active");
  }

  showToast(msg, type = "toast-info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span class="toast-msg">${msg}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 250);
    }, 4000);
  }
}

// Initialize Application when DOM is ready
window.addEventListener("DOMContentLoaded", () => {
  window.marketLab = new MarketSimulation();
  window.marketLab.init();
});
