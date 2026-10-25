import React, { useState, useEffect, useRef } from 'react';
import {
  OrderBookState,
  OrderSide,
  OrderType,
  Trade,
  createInitialOrderBook,
  submitOrder,
  generateSyntheticFlow,
} from '../orderBookEngine';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Play,
  Pause,
  RotateCcw,
  Zap,
  ArrowRight,
  Info,
  CheckCircle,
} from 'lucide-react';

export const OrderBookSimulator: React.FC = () => {
  const [book, setBook] = useState<OrderBookState>(() => createInitialOrderBook(150.0));
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(false);
  const streamTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // User Order Entry State
  const [orderSide, setOrderSide] = useState<OrderSide>('BUY');
  const [orderType, setOrderType] = useState<OrderType>('LIMIT');
  const [orderPrice, setOrderPrice] = useState<string>('150.05');
  const [orderShares, setOrderShares] = useState<string>('100');
  const [lastExecutionNotice, setLastExecutionNotice] = useState<string | null>(null);

  // Background market flow generator
  useEffect(() => {
    if (isLiveStreaming) {
      streamTimerRef.current = setInterval(() => {
        setBook((prev) => generateSyntheticFlow(prev));
      }, 1600);
    } else {
      if (streamTimerRef.current) {
        clearInterval(streamTimerRef.current);
        streamTimerRef.current = null;
      }
    }

    return () => {
      if (streamTimerRef.current) {
        clearInterval(streamTimerRef.current);
        streamTimerRef.current = null;
      }
    };
  }, [isLiveStreaming]);

  // Order submission handler
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedShares = parseInt(orderShares, 10);
    const parsedPrice = parseFloat(orderPrice);

    if (isNaN(parsedShares) || parsedShares <= 0) return;
    if (orderType === 'LIMIT' && (isNaN(parsedPrice) || parsedPrice <= 0)) return;

    const result = submitOrder(book, {
      side: orderSide,
      type: orderType,
      price: orderType === 'LIMIT' ? Number(parsedPrice.toFixed(2)) : 0,
      shares: parsedShares,
      trader: 'USER',
    });

    setBook(result.nextBook);

    if (result.executedTrades.length > 0) {
      const filledShares = parsedShares - result.unfilledShares;
      const slippage =
        orderType === 'MARKET' && book.bestAsk && book.bestBid
          ? orderSide === 'BUY'
            ? Number(((result.avgFillPrice || 0) - book.bestAsk).toFixed(2))
            : Number((book.bestBid - (result.avgFillPrice || 0)).toFixed(2))
          : 0;

      const notice = `Filled ${filledShares}/${parsedShares} shares at avg $${result.avgFillPrice?.toFixed(2)}${
        slippage > 0 ? ` (Slippage: +$${slippage})` : ''
      }${result.unfilledShares > 0 ? ` — ${result.unfilledShares} resting on book` : ''}`;
      setLastExecutionNotice(notice);
    } else {
      setLastExecutionNotice(
        `Limit order for ${parsedShares} shares placed at $${parsedPrice.toFixed(2)} (Resting on book)`
      );
    }
  };

  const handleReset = () => {
    setBook(createInitialOrderBook(150.0));
    setIsLiveStreaming(false);
    setLastExecutionNotice(null);
  };

  // Compute maximum depth size for relative bar visualization
  const maxBidShares = Math.max(1, ...book.bids.map((b) => b.remainingShares));
  const maxAskShares = Math.max(1, ...book.asks.map((a) => a.remainingShares));
  const maxShareScale = Math.max(maxBidShares, maxAskShares);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%',
        color: '#E2E8F0',
        fontFamily: 'var(--font-body, Inter, sans-serif)',
      }}
    >
      {/* Top Banner / Ticker Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(30,41,59,0.9) 0%, rgba(15,23,42,0.95) 100%)',
          border: '1px solid rgba(56,189,248,0.3)',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              padding: '10px',
              borderRadius: '10px',
              backgroundColor: 'rgba(56,189,248,0.15)',
              color: '#38BDF8',
              display: 'flex',
            }}
          >
            <Activity size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#F8FAFC' }}>
                GENI (Geniusphere Global Tech)
              </h3>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(34,197,94,0.15)',
                  color: '#4ADE80',
                  border: '1px solid rgba(34,197,94,0.3)',
                }}
              >
                NASDAQ SIM
              </span>
            </div>
            <div style={{ display: 'flex', gap: '14px', marginTop: '4px', fontSize: '0.8rem' }}>
              <span style={{ color: '#94A3B8' }}>
                Last: <b style={{ color: '#F8FAFC' }}>${book.lastPrice.toFixed(2)}</b>
              </span>
              <span style={{ color: '#94A3B8' }}>
                Spread:{' '}
                <b style={{ color: '#FCD34D' }}>
                  {book.spread !== null ? `$${book.spread.toFixed(2)}` : 'N/A'}
                </b>
              </span>
              <span style={{ color: '#94A3B8' }}>
                Vol: <b style={{ color: '#E2E8F0' }}>{book.totalVolume.toLocaleString()} shs</b>
              </span>
            </div>
          </div>
        </div>

        {/* Live Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setIsLiveStreaming((p) => !p)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: isLiveStreaming ? '1px solid #22C55E' : '1px solid rgba(148,163,184,0.3)',
              backgroundColor: isLiveStreaming ? 'rgba(34,197,94,0.2)' : 'rgba(30,41,59,0.7)',
              color: isLiveStreaming ? '#4ADE80' : '#E2E8F0',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            {isLiveStreaming ? <Pause size={14} /> : <Play size={14} />}
            {isLiveStreaming ? 'Live Stream Active' : 'Start Market Flow'}
          </button>

          <button
            type="button"
            onClick={handleReset}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(148,163,184,0.3)',
              backgroundColor: 'rgba(30,41,59,0.7)',
              color: '#94A3B8',
              fontWeight: 600,
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>
      </div>

      {/* Main Order Book Grid: Depth Ladder vs Order Entry vs Trade Tape */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Order Book Depth Ladder */}
        <div
          style={{
            background: '#070B1A',
            border: '1px solid #1E293B',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#38BDF8' }}>
              CONTINUOUS LIMIT ORDER BOOK
            </span>
            <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Price-Time Priority (FIFO)</span>
          </div>

          {/* Asks (Sell Orders - Ascending) */}
          <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: '3px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#64748B', fontWeight: 700, paddingBottom: '2px' }}>
              <span>SELL ASKS</span>
              <span>SHARES</span>
              <span>TRADER</span>
            </div>
            {book.asks.slice(0, 5).map((ask) => {
              const widthPct = Math.round((ask.remainingShares / maxShareScale) * 100);
              return (
                <div
                  key={ask.id}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 0,
                      bottom: 0,
                      width: `${widthPct}%`,
                      backgroundColor: 'rgba(239,68,68,0.15)',
                      zIndex: 0,
                    }}
                  />
                  <span style={{ color: '#F87171', fontWeight: 800, zIndex: 1 }}>
                    ${ask.price.toFixed(2)}
                  </span>
                  <span style={{ color: '#CBD5E1', zIndex: 1 }}>{ask.remainingShares}</span>
                  <span style={{ color: '#64748B', fontSize: '0.65rem', zIndex: 1 }}>
                    {ask.trader}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Top-of-Book Spread Indicator */}
          <div
            style={{
              padding: '6px 12px',
              backgroundColor: 'rgba(30,41,59,0.8)',
              borderRadius: '6px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '1px dashed #334155',
              fontSize: '0.72rem',
            }}
          >
            <span style={{ color: '#94A3B8' }}>Spread:</span>
            <span style={{ fontWeight: 800, color: '#FCD34D', fontFamily: 'monospace' }}>
              ${book.spread !== null ? book.spread.toFixed(2) : '0.00'}
            </span>
          </div>

          {/* Bids (Buy Orders - Descending) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#64748B', fontWeight: 700, paddingBottom: '2px' }}>
              <span>BUY BIDS</span>
              <span>SHARES</span>
              <span>TRADER</span>
            </div>
            {book.bids.slice(0, 5).map((bid) => {
              const widthPct = Math.round((bid.remainingShares / maxShareScale) * 100);
              return (
                <div
                  key={bid.id}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: `${widthPct}%`,
                      backgroundColor: 'rgba(34,197,94,0.15)',
                      zIndex: 0,
                    }}
                  />
                  <span style={{ color: '#4ADE80', fontWeight: 800, zIndex: 1 }}>
                    ${bid.price.toFixed(2)}
                  </span>
                  <span style={{ color: '#CBD5E1', zIndex: 1 }}>{bid.remainingShares}</span>
                  <span style={{ color: '#64748B', fontSize: '0.65rem', zIndex: 1 }}>
                    {bid.trader}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Placement Terminal */}
        <div
          style={{
            background: '#070B1A',
            border: '1px solid #1E293B',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#38BDF8' }}>
            ORDER EXECUTION TERMINAL
          </span>

          <form onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Side Tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setOrderSide('BUY')}
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  border: orderSide === 'BUY' ? '1px solid #22C55E' : '1px solid #334155',
                  backgroundColor: orderSide === 'BUY' ? 'rgba(34,197,94,0.2)' : 'rgba(15,23,42,0.6)',
                  color: orderSide === 'BUY' ? '#4ADE80' : '#94A3B8',
                }}
              >
                BUY
              </button>
              <button
                type="button"
                onClick={() => setOrderSide('SELL')}
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  border: orderSide === 'SELL' ? '1px solid #EF4444' : '1px solid #334155',
                  backgroundColor: orderSide === 'SELL' ? 'rgba(239,68,68,0.2)' : 'rgba(15,23,42,0.6)',
                  color: orderSide === 'SELL' ? '#F87171' : '#94A3B8',
                }}
              >
                SELL
              </button>
            </div>

            {/* Order Type Tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setOrderType('LIMIT')}
                style={{
                  padding: '6px',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  border: orderType === 'LIMIT' ? '1px solid #38BDF8' : '1px solid #334155',
                  backgroundColor: orderType === 'LIMIT' ? 'rgba(56,189,248,0.2)' : 'rgba(15,23,42,0.6)',
                  color: orderType === 'LIMIT' ? '#38BDF8' : '#94A3B8',
                }}
              >
                Limit Order
              </button>
              <button
                type="button"
                onClick={() => setOrderType('MARKET')}
                style={{
                  padding: '6px',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  border: orderType === 'MARKET' ? '1px solid #38BDF8' : '1px solid #334155',
                  backgroundColor: orderType === 'MARKET' ? 'rgba(56,189,248,0.2)' : 'rgba(15,23,42,0.6)',
                  color: orderType === 'MARKET' ? '#38BDF8' : '#94A3B8',
                }}
              >
                Market Order
              </button>
            </div>

            {/* Price Input (if limit) */}
            {orderType === 'LIMIT' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Limit Price ($):</label>
                <input
                  type="number"
                  step="0.01"
                  value={orderPrice}
                  onChange={(e) => setOrderPrice(e.target.value)}
                  style={{
                    background: '#0B1021',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    padding: '8px',
                    fontSize: '0.85rem',
                    color: '#F8FAFC',
                    fontFamily: 'monospace',
                  }}
                />
              </div>
            )}

            {/* Shares Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Shares Quantity:</label>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {['50', '100', '250', '500'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setOrderShares(preset)}
                      style={{
                        padding: '1px 5px',
                        fontSize: '0.65rem',
                        borderRadius: '3px',
                        border: '1px solid #334155',
                        backgroundColor: '#1E293B',
                        color: '#94A3B8',
                        cursor: 'pointer',
                      }}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="number"
                step="1"
                min="1"
                value={orderShares}
                onChange={(e) => setOrderShares(e.target.value)}
                style={{
                  background: '#0B1021',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  padding: '8px',
                  fontSize: '0.85rem',
                  color: '#F8FAFC',
                  fontFamily: 'monospace',
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                marginTop: '6px',
                padding: '10px',
                borderRadius: '8px',
                backgroundColor: orderSide === 'BUY' ? '#16A34A' : '#DC2626',
                border: 'none',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              {orderSide} {orderShares} Shares ({orderType})
            </button>
          </form>

          {lastExecutionNotice && (
            <div
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                backgroundColor: 'rgba(56,189,248,0.1)',
                border: '1px solid rgba(56,189,248,0.3)',
                color: '#38BDF8',
                fontSize: '0.72rem',
                lineHeight: '1.4',
              }}
            >
              <b>Execution Report:</b> {lastExecutionNotice}
            </div>
          )}
        </div>

        {/* Real-Time Trade Tape */}
        <div
          style={{
            background: '#070B1A',
            border: '1px solid #1E293B',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#38BDF8' }}>
              TIME & SALES (EXECUTION TAPE)
            </span>
            <span style={{ fontSize: '0.65rem', color: '#64748B' }}>Live Trades</span>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              maxHeight: '280px',
              overflowY: 'auto',
              fontFamily: 'monospace',
            }}
          >
            {book.trades.map((trd) => (
              <div
                key={trd.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(15,23,42,0.6)',
                  fontSize: '0.72rem',
                }}
              >
                <span
                  style={{
                    color: trd.takerSide === 'BUY' ? '#4ADE80' : '#F87171',
                    fontWeight: 800,
                  }}
                >
                  ${trd.price.toFixed(2)}
                </span>
                <span style={{ color: '#E2E8F0' }}>{trd.shares} shs</span>
                <span style={{ color: '#64748B', fontSize: '0.65rem' }}>
                  {trd.buyerTrader} ← {trd.sellerTrader}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
