/**
 * Geniusphere — Stock Market Order Book Simulation Engine
 * 
 * Deterministic continuous double auction (CDA) matching engine with:
 * - Price-time priority matching (FIFO at price levels)
 * - Limit and Market order execution
 * - Bid/Ask book sorting and spread calculation
 * - Real trade execution logging (tape)
 * - Slippage and VWAP metrics
 */

export type OrderSide = 'BUY' | 'SELL';
export type OrderType = 'LIMIT' | 'MARKET';

export interface Order {
  id: string;
  side: OrderSide;
  type: OrderType;
  price: number; // 0 for market orders
  shares: number;
  remainingShares: number;
  timestamp: number;
  trader: 'USER' | 'INSTITUTION' | 'RETAIL' | 'MARKET_MAKER';
}

export interface Trade {
  id: string;
  price: number;
  shares: number;
  timestamp: number;
  buyerTrader: string;
  sellerTrader: string;
  takerSide: OrderSide;
}

export interface OrderBookState {
  bids: Order[]; // Sorted descending by price, then ascending by timestamp
  asks: Order[]; // Sorted ascending by price, then ascending by timestamp
  trades: Trade[]; // Most recent execution tape
  lastPrice: number;
  totalVolume: number;
  bestBid: number | null;
  bestAsk: number | null;
  spread: number | null;
}

export interface OrderSubmissionResult {
  nextBook: OrderBookState;
  executedTrades: Trade[];
  unfilledShares: number;
  avgFillPrice: number | null;
}

/**
 * Creates a realistic starting order book around a central price of $150.00
 */
export function createInitialOrderBook(basePrice: number = 150.0): OrderBookState {
  const bids: Order[] = [
    {
      id: 'init-bid-1',
      side: 'BUY',
      type: 'LIMIT',
      price: Number((basePrice - 0.05).toFixed(2)),
      shares: 100,
      remainingShares: 100,
      timestamp: Date.now() - 5000,
      trader: 'MARKET_MAKER',
    },
    {
      id: 'init-bid-2',
      side: 'BUY',
      type: 'LIMIT',
      price: Number((basePrice - 0.15).toFixed(2)),
      shares: 250,
      remainingShares: 250,
      timestamp: Date.now() - 4000,
      trader: 'INSTITUTION',
    },
    {
      id: 'init-bid-3',
      side: 'BUY',
      type: 'LIMIT',
      price: Number((basePrice - 0.3).toFixed(2)),
      shares: 500,
      remainingShares: 500,
      timestamp: Date.now() - 3000,
      trader: 'RETAIL',
    },
  ];

  const asks: Order[] = [
    {
      id: 'init-ask-1',
      side: 'SELL',
      type: 'LIMIT',
      price: Number((basePrice + 0.05).toFixed(2)),
      shares: 100,
      remainingShares: 100,
      timestamp: Date.now() - 5000,
      trader: 'MARKET_MAKER',
    },
    {
      id: 'init-ask-2',
      side: 'SELL',
      type: 'LIMIT',
      price: Number((basePrice + 0.15).toFixed(2)),
      shares: 200,
      remainingShares: 200,
      timestamp: Date.now() - 4000,
      trader: 'INSTITUTION',
    },
    {
      id: 'init-ask-3',
      side: 'SELL',
      type: 'LIMIT',
      price: Number((basePrice + 0.35).toFixed(2)),
      shares: 400,
      remainingShares: 400,
      timestamp: Date.now() - 3000,
      trader: 'RETAIL',
    },
  ];

  return computeBookMetrics({
    bids,
    asks,
    trades: [
      {
        id: 'init-trade-1',
        price: basePrice,
        shares: 100,
        timestamp: Date.now() - 6000,
        buyerTrader: 'RETAIL',
        sellerTrader: 'MARKET_MAKER',
        takerSide: 'BUY',
      },
    ],
    lastPrice: basePrice,
    totalVolume: 100,
    bestBid: null,
    bestAsk: null,
    spread: null,
  });
}

/**
 * Re-sorts order books and recomputes top-of-book metrics (BBO and spread)
 */
export function computeBookMetrics(book: OrderBookState): OrderBookState {
  // Sort bids: descending price, ascending timestamp
  const sortedBids = [...book.bids].sort((a, b) => {
    if (b.price !== a.price) return b.price - a.price;
    return a.timestamp - b.timestamp;
  });

  // Sort asks: ascending price, ascending timestamp
  const sortedAsks = [...book.asks].sort((a, b) => {
    if (a.price !== b.price) return a.price - b.price;
    return a.timestamp - b.timestamp;
  });

  const bestBid = sortedBids.length > 0 ? sortedBids[0].price : null;
  const bestAsk = sortedAsks.length > 0 ? sortedAsks[0].price : null;
  const spread =
    bestBid !== null && bestAsk !== null ? Number((bestAsk - bestBid).toFixed(2)) : null;

  return {
    ...book,
    bids: sortedBids,
    asks: sortedAsks,
    bestBid,
    bestAsk,
    spread,
  };
}

/**
 * Executes an incoming order against the resting order book
 */
export function submitOrder(
  book: OrderBookState,
  newOrder: Omit<Order, 'id' | 'remainingShares' | 'timestamp'> & { id?: string }
): OrderSubmissionResult {
  const order: Order = {
    ...newOrder,
    id: newOrder.id || `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    remainingShares: newOrder.shares,
    timestamp: Date.now(),
  };

  const executedTrades: Trade[] = [];
  let remainingShares = order.shares;
  let remainingBids = [...book.bids];
  let remainingAsks = [...book.asks];
  let lastPrice = book.lastPrice;
  let additionalVolume = 0;
  let tradePriceSum = 0;

  if (order.side === 'BUY') {
    // Buy orders match against Asks (lowest price first)
    const newAsks: Order[] = [];

    for (const ask of remainingAsks) {
      if (remainingShares <= 0) {
        newAsks.push(ask);
        continue;
      }

      const isMatch = order.type === 'MARKET' || order.price >= ask.price;

      if (isMatch) {
        const fillShares = Math.min(remainingShares, ask.remainingShares);
        const execPrice = ask.price;

        executedTrades.push({
          id: `trd-${Date.now()}-${executedTrades.length}`,
          price: execPrice,
          shares: fillShares,
          timestamp: Date.now(),
          buyerTrader: order.trader,
          sellerTrader: ask.trader,
          takerSide: 'BUY',
        });

        remainingShares -= fillShares;
        ask.remainingShares -= fillShares;
        lastPrice = execPrice;
        additionalVolume += fillShares;
        tradePriceSum += execPrice * fillShares;

        if (ask.remainingShares > 0) {
          newAsks.push(ask);
        }
      } else {
        newAsks.push(ask);
      }
    }

    remainingAsks = newAsks;

    // If remaining unfilled limit order, rest on the bid book
    if (order.type === 'LIMIT' && remainingShares > 0) {
      remainingBids.push({
        ...order,
        remainingShares,
      });
    }
  } else {
    // Sell orders match against Bids (highest price first)
    const newBids: Order[] = [];

    for (const bid of remainingBids) {
      if (remainingShares <= 0) {
        newBids.push(bid);
        continue;
      }

      const isMatch = order.type === 'MARKET' || order.price <= bid.price;

      if (isMatch) {
        const fillShares = Math.min(remainingShares, bid.remainingShares);
        const execPrice = bid.price;

        executedTrades.push({
          id: `trd-${Date.now()}-${executedTrades.length}`,
          price: execPrice,
          shares: fillShares,
          timestamp: Date.now(),
          buyerTrader: bid.trader,
          sellerTrader: order.trader,
          takerSide: 'SELL',
        });

        remainingShares -= fillShares;
        bid.remainingShares -= fillShares;
        lastPrice = execPrice;
        additionalVolume += fillShares;
        tradePriceSum += execPrice * fillShares;

        if (bid.remainingShares > 0) {
          newBids.push(bid);
        }
      } else {
        newBids.push(bid);
      }
    }

    remainingBids = newBids;

    // If remaining unfilled limit order, rest on the ask book
    if (order.type === 'LIMIT' && remainingShares > 0) {
      remainingAsks.push({
        ...order,
        remainingShares,
      });
    }
  }

  const filledShares = order.shares - remainingShares;
  const avgFillPrice =
    filledShares > 0 ? Number((tradePriceSum / filledShares).toFixed(2)) : null;

  const nextBook = computeBookMetrics({
    bids: remainingBids,
    asks: remainingAsks,
    trades: [...executedTrades, ...book.trades].slice(0, 30), // keep latest 30
    lastPrice,
    totalVolume: book.totalVolume + additionalVolume,
    bestBid: null,
    bestAsk: null,
    spread: null,
  });

  return {
    nextBook,
    executedTrades,
    unfilledShares: remainingShares,
    avgFillPrice,
  };
}

/**
 * Generates an automated synthetic market action (Retail/Institutional flow)
 */
export function generateSyntheticFlow(book: OrderBookState): OrderBookState {
  if (book.bestBid === null || book.bestAsk === null) {
    return createInitialOrderBook(book.lastPrice || 150);
  }

  const isBuy = Math.random() > 0.5;
  const isMarket = Math.random() > 0.7; // 30% chance market order, 70% limit

  if (isMarket) {
    const shares = [20, 50, 100][Math.floor(Math.random() * 3)];
    const result = submitOrder(book, {
      side: isBuy ? 'BUY' : 'SELL',
      type: 'MARKET',
      price: 0,
      shares,
      trader: Math.random() > 0.5 ? 'RETAIL' : 'INSTITUTION',
    });
    return result.nextBook;
  } else {
    // Generate limit order close to top of book
    const tick = 0.05;
    const priceDelta = (Math.floor(Math.random() * 4) + 1) * tick;
    const price = isBuy
      ? Number((book.bestBid - priceDelta).toFixed(2))
      : Number((book.bestAsk + priceDelta).toFixed(2));

    const shares = [50, 100, 150, 200][Math.floor(Math.random() * 4)];
    const result = submitOrder(book, {
      side: isBuy ? 'BUY' : 'SELL',
      type: 'LIMIT',
      price,
      shares,
      trader: 'INSTITUTION',
    });
    return result.nextBook;
  }
}
