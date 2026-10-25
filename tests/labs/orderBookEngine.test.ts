import { describe, it, expect } from 'vitest';
import {
  createInitialOrderBook,
  submitOrder,
  computeBookMetrics,
  generateSyntheticFlow,
} from '../../src/labs/stock-market-lab/orderBookEngine';

describe('Order Book Continuous Double Auction Matching Engine', () => {
  it('initializes book with proper bids, asks, and positive spread', () => {
    const book = createInitialOrderBook(150.0);
    expect(book.bestBid).toBe(149.95);
    expect(book.bestAsk).toBe(150.05);
    expect(book.spread).toBe(0.1);
    expect(book.bids.length).toBeGreaterThan(0);
    expect(book.asks.length).toBeGreaterThan(0);
  });

  it('matches aggressive limit buy against lowest ask', () => {
    const book = createInitialOrderBook(150.0);
    const result = submitOrder(book, {
      side: 'BUY',
      type: 'LIMIT',
      price: 150.05,
      shares: 50,
      trader: 'USER',
    });

    expect(result.executedTrades.length).toBe(1);
    expect(result.executedTrades[0].price).toBe(150.05);
    expect(result.executedTrades[0].shares).toBe(50);
    expect(result.unfilledShares).toBe(0);
    expect(result.nextBook.asks[0].remainingShares).toBe(50); // was 100
  });

  it('executes market order sweeping multiple price levels with slippage', () => {
    const book = createInitialOrderBook(150.0);
    // Sweeps 100 @ 150.05, and 150 @ 150.15 = 250 shares
    const result = submitOrder(book, {
      side: 'BUY',
      type: 'MARKET',
      price: 0,
      shares: 250,
      trader: 'USER',
    });

    expect(result.executedTrades.length).toBe(2);
    expect(result.executedTrades[0].price).toBe(150.05);
    expect(result.executedTrades[0].shares).toBe(100);
    expect(result.executedTrades[1].price).toBe(150.15);
    expect(result.executedTrades[1].shares).toBe(150);
    expect(result.unfilledShares).toBe(0);
    expect(result.avgFillPrice).toBeGreaterThan(150.05); // experienced upward slippage
  });

  it('rests passive limit order on the book when not crossing the spread', () => {
    const book = createInitialOrderBook(150.0);
    // Best bid is 149.95. Place limit buy at 149.98 to tighten spread
    const result = submitOrder(book, {
      side: 'BUY',
      type: 'LIMIT',
      price: 149.98,
      shares: 100,
      trader: 'USER',
    });

    expect(result.executedTrades.length).toBe(0);
    expect(result.unfilledShares).toBe(100);
    expect(result.nextBook.bestBid).toBe(149.98);
    expect(result.nextBook.spread).toBe(0.07); // 150.05 - 149.98
  });

  it('generates synthetic market flow without crashing or corrupting book', () => {
    let book = createInitialOrderBook(150.0);
    for (let i = 0; i < 15; i++) {
      book = generateSyntheticFlow(book);
    }
    expect(book.totalVolume).toBeGreaterThan(100);
    expect(book.bids.length).toBeGreaterThan(0);
    expect(book.asks.length).toBeGreaterThan(0);
  });
});
