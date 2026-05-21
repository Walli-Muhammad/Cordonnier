'use client';

import { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Package, 
  Layers, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Bell, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Truck, 
  XCircle, 
  DollarSign, 
  RefreshCw, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  ExternalLink 
} from 'lucide-react';
import { 
  getAdminProducts, 
  deleteProduct, 
  getCategories, 
  addCategory, 
  deleteCategory, 
  getAdminOrders, 
  updateOrderStatus,
  type Order,
  type OrderItem
} from '@/actions/admin';
import type { Product } from '@/lib/supabase';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'categories'>('orders');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Loading & Action states
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState('');
  const [newCatName, setNewCatName] = useState('');
  
  // Modals & Notifications
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [orderToUpdate, setOrderToUpdate] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [newOrderAlert, setNewOrderAlert] = useState<boolean>(false);
  const [previousOrderCount, setPreviousOrderCount] = useState<number>(0);

  // Load dashboard data
  const loadData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [prodData, catData, orderData] = await Promise.all([
        getAdminProducts(),
        getCategories(),
        getAdminOrders()
      ]);
      setProducts(prodData as Product[]);
      setCategories(catData);
      setOrders(orderData);

      // Check if new orders were placed (for live notification center)
      if (silent && orderData.length > previousOrderCount && previousOrderCount > 0) {
        setNewOrderAlert(true);
        showToast('New order placed just now! 🚀', 'info');
        // Play subtle custom audio beep if supported by browser
        try {
          const context = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = context.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(587.33, context.currentTime); // D5 note
          osc.connect(context.destination);
          osc.start();
          osc.stop(context.currentTime + 0.15);
        } catch (_) {}
      }
      setPreviousOrderCount(orderData.length);
    } catch (err) {
      showToast('Failed to sync dashboard data.', 'error');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // ─── REAL-TIME NOTIFICATION POLLING (Every 10 seconds) ───
    const interval = setInterval(() => {
      loadData(true);
    }, 10000);

    return () => clearInterval(interval);
  }, [previousOrderCount]);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // ─── PRODUCT ACTIONS ───
  const handleDeleteProduct = (id: string) => {
    startTransition(async () => {
      const res = await deleteProduct(id);
      if (res.success) {
        showToast('Product archived successfully.', 'success');
        setProducts(products.filter(p => p.id !== id));
      } else {
        showToast(res.error || 'Failed to delete product.', 'error');
      }
      setProductToDelete(null);
    });
  };

  // ─── CATEGORY ACTIONS ───
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    startTransition(async () => {
      const res = await addCategory(newCatName);
      if (res.success) {
        showToast(`Category "${newCatName}" added!`, 'success');
        setNewCatName('');
        // Reload categories
        const catData = await getCategories();
        setCategories(catData);
      } else {
        showToast(res.error || 'Failed to add category.', 'error');
      }
    });
  };

  const handleDeleteCategory = async (id: string) => {
    startTransition(async () => {
      const res = await deleteCategory(id);
      if (res.success) {
        showToast('Category deleted successfully.', 'success');
        setCategories(categories.filter(c => c.id !== id));
      } else {
        showToast(res.error || 'Failed to delete category.', 'error');
      }
    });
  };

  // ─── ORDER ACTIONS ───
  const handleUpdateStatus = async (orderId: string, status: string) => {
    startTransition(async () => {
      const res = await updateOrderStatus(orderId, status);
      if (res.success) {
        showToast('Order status updated.', 'success');
        setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
      } else {
        showToast(res.error || 'Failed to update status.', 'error');
      }
      setOrderToUpdate(null);
    });
  };

  // ─── ANALYTICS STATISTICS ───
  const totalSales = orders
    .filter(o => o.status === 'payment_received' || o.status === 'processing' || o.status === 'shipped' || o.status === 'delivered')
    .reduce((sum, o) => sum + Number(o.total_pkr), 0);

  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'payment_received': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'processing': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'shipped': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'delivered': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'cancelled': return 'bg-zinc-800 text-zinc-500 border-zinc-700/50';
      default: return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-3.5 h-3.5" />;
      case 'payment_received': return <DollarSign className="w-3.5 h-3.5" />;
      case 'processing': return <RefreshCw className="w-3.5 h-3.5 animate-spin" />;
      case 'shipped': return <Truck className="w-3.5 h-3.5" />;
      case 'delivered': return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 'cancelled': return <XCircle className="w-3.5 h-3.5" />;
      default: return <AlertCircle className="w-3.5 h-3.5" />;
    }
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 pb-16">
      
      {/* ─── TOAST NOTIFICATIONS ─── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-5 py-4 rounded-xl border shadow-xl backdrop-blur-md max-w-sm ${
              toast.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                : toast.type === 'error'
                ? 'bg-red-500/10 border-red-500/20 text-red-400'
                : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 shrink-0" />}
            {toast.type === 'info' && <Bell className="w-5 h-5 shrink-0 animate-bounce" />}
            <span className="text-sm font-medium leading-relaxed">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── HEADER WITH NEW ORDER ALERT ─── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-900 pb-8">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">Dashboard</h1>
          <p className="text-zinc-500 text-sm mt-1">Manage orders, product catalog, and categories in real time.</p>
        </div>

        <div className="flex items-center gap-3">
          {newOrderAlert && (
            <button 
              onClick={() => { setNewOrderAlert(false); setActiveTab('orders'); }}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 text-xs font-semibold rounded-full hover:bg-indigo-500/20 transition-all animate-pulse"
            >
              <Bell className="w-3.5 h-3.5 animate-bounce" />
              New Order Notification Pending
            </button>
          )}

          <button 
            onClick={() => loadData()}
            className="p-2.5 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white rounded-xl transition-all"
            title="Force refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
          </button>

          <Link
            href="/admin/products/new"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Link>
        </div>
      </div>

      {/* ─── ANALYTICS OVERVIEW ─── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Sales */}
        <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-zinc-500 text-xs uppercase tracking-widest block font-medium">Revenue (PKR)</span>
            <span className="text-2xl font-black text-white mt-1.5 block">
              Rs {totalSales.toLocaleString('en-PK')}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/10">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-zinc-500 text-xs uppercase tracking-widest block font-medium">Total Orders</span>
            <span className="text-2xl font-black text-white mt-1.5 block">
              {orders.length}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/10">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-zinc-500 text-xs uppercase tracking-widest block font-medium">Pending Orders</span>
            <span className="text-2xl font-black text-white mt-1.5 block">
              {pendingOrders}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/10">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        {/* Active Products */}
        <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-zinc-500 text-xs uppercase tracking-widest block font-medium">Active Products</span>
            <span className="text-2xl font-black text-white mt-1.5 block">
              {products.length}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/10">
            <Package className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ─── TABS NAVIGATION ─── */}
      <div className="flex gap-2 border-b border-zinc-900 pb-px">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-semibold text-sm transition-all ${
            activeTab === 'orders' 
              ? 'border-indigo-500 text-white bg-indigo-500/5' 
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          Orders & Notifications
          {pendingOrders > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-bold">
              {pendingOrders}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-semibold text-sm transition-all ${
            activeTab === 'products' 
              ? 'border-indigo-500 text-white bg-indigo-500/5' 
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Package className="w-4 h-4" />
          Products Catalog
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-semibold text-sm transition-all ${
            activeTab === 'categories' 
              ? 'border-indigo-500 text-white bg-indigo-500/5' 
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Layers className="w-4 h-4" />
          Categories Manager
        </button>
      </div>

      {/* ─── TAB CONTENT ─── */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-4 text-center">
          <div className="w-10 h-10 border-2 border-zinc-800 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-zinc-500 text-sm">Syncing Cordonnier Database...</p>
        </div>
      ) : (
        <div>
          {/* TAB 1: ORDERS & NOTIFICATIONS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {orders.length === 0 ? (
                <div className="py-16 text-center border border-dashed border-zinc-900 rounded-2xl bg-zinc-950/20">
                  <ShoppingBag className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                  <p className="text-white font-medium">No orders yet</p>
                  <p className="text-zinc-500 text-xs mt-1">Orders placed by customers will appear here in real time.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  {orders.map((order) => (
                    <div 
                      key={order.id}
                      className="bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800 rounded-2xl p-6 transition-all space-y-6 relative overflow-hidden group"
                    >
                      {/* Top banner / Order metadata */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-900 pb-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono text-xs uppercase tracking-widest text-indigo-400 font-bold">
                              #{order.id.slice(0, 8).toUpperCase()}
                            </span>
                            <span className="text-zinc-600 text-xs">•</span>
                            <span className="text-zinc-500 text-xs">
                              {new Date(order.created_at).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <h3 className="text-white font-bold text-lg">{order.customer_name}</h3>
                          </div>
                        </div>

                        {/* Order status dropdown actions */}
                        <div className="flex items-center gap-2">
                          <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.status.replace('_', ' ')}
                          </span>

                          <div className="relative">
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                              disabled={isPending}
                              className="bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-xs font-medium rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors appearance-none cursor-pointer pr-8"
                            >
                              <option value="pending">Pending</option>
                              <option value="payment_received">Payment Received</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            <span className="absolute top-1/2 right-3 -translate-y-1/2 text-zinc-500 pointer-events-none text-[10px]">▼</span>
                          </div>
                        </div>
                      </div>

                      {/* Content block: Customer Details + Items */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* Column 1: Customer Contact info */}
                        <div className="space-y-4 text-sm bg-zinc-950/40 p-4 rounded-xl border border-zinc-900/60">
                          <h4 className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Customer Details</h4>
                          <ul className="space-y-3.5">
                            <li className="flex items-center gap-2.5 text-zinc-300">
                              <User className="w-4 h-4 text-zinc-500" />
                              <span className="font-medium truncate">{order.customer_name}</span>
                            </li>
                            <li className="flex items-center gap-2.5 text-zinc-300">
                              <Mail className="w-4 h-4 text-zinc-500" />
                              <a href={`mailto:${order.customer_email}`} className="hover:text-indigo-400 hover:underline truncate">
                                {order.customer_email}
                              </a>
                            </li>
                            <li className="flex items-center gap-2.5 text-zinc-300">
                              <Phone className="w-4 h-4 text-zinc-500" />
                              <a href={`tel:${order.customer_phone}`} className="hover:text-indigo-400 hover:underline font-mono">
                                {order.customer_phone}
                              </a>
                            </li>
                          </ul>
                        </div>

                        {/* Column 2: Shipping Address & Payment */}
                        <div className="space-y-4 text-sm bg-zinc-950/40 p-4 rounded-xl border border-zinc-900/60">
                          <h4 className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Shipment & Billing</h4>
                          <div className="space-y-3.5">
                            <div className="flex gap-2.5 text-zinc-300">
                              <MapPin className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                              <div>
                                <p className="leading-relaxed">{order.address_line1}</p>
                                <p className="text-zinc-500 mt-0.5">{order.city}, {order.province}</p>
                              </div>
                            </div>
                            <div className="border-t border-zinc-900 pt-2 flex justify-between items-center text-xs">
                              <span className="text-zinc-500 font-medium uppercase tracking-wider">Gateway:</span>
                              <span className="text-zinc-300 uppercase tracking-widest font-bold bg-indigo-950/20 px-2 py-0.5 rounded border border-indigo-900/30">
                                {order.gateway}
                              </span>
                            </div>
                            {order.gateway_txn_ref && (
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-zinc-500">Txn Ref:</span>
                                <span className="text-zinc-400 font-mono select-all truncate max-w-[120px]" title={order.gateway_txn_ref}>
                                  {order.gateway_txn_ref}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Column 3: Totals Summary */}
                        <div className="space-y-4 text-sm bg-zinc-950/40 p-4 rounded-xl border border-zinc-900/60 flex flex-col justify-between">
                          <div>
                            <h4 className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] mb-3">Order Total</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between text-zinc-500 text-xs">
                                <span>Subtotal</span>
                                <span>Rs {Number(order.subtotal_pkr).toLocaleString('en-PK')}</span>
                              </div>
                              <div className="flex justify-between text-zinc-500 text-xs">
                                <span>Shipping</span>
                                <span>Rs {Number(order.shipping_pkr).toLocaleString('en-PK')}</span>
                              </div>
                              <div className="border-t border-zinc-900 my-2 pt-2 flex justify-between text-white font-bold">
                                <span>Grand Total</span>
                                <span className="text-indigo-400 font-black">Rs {Number(order.total_pkr).toLocaleString('en-PK')}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Sub-block: Ordered items */}
                      <div className="border-t border-zinc-900 pt-4 space-y-3">
                        <h4 className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Purchased Items ({order.order_items?.length ?? 0})</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {order.order_items?.map((item) => (
                            <div 
                              key={item.id}
                              className="flex items-start gap-4 p-3 bg-zinc-950/20 border border-zinc-900 rounded-xl"
                            >
                              <div className="relative w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden shrink-0">
                                {item.product_image_url ? (
                                  <Image
                                    src={item.product_image_url}
                                    alt={item.product_title}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-zinc-700 text-xs">Shoe</div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h5 className="text-white font-semibold text-sm truncate uppercase tracking-tight">{item.product_title}</h5>
                                <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500">
                                  <span>Qty: {item.quantity}</span>
                                  <span>•</span>
                                  <span>Rs {Number(item.unit_price_pkr).toLocaleString('en-PK')} ea</span>
                                </div>

                                {/* Custom POD item spec sheet details */}
                                {item.is_pod && item.pod_customization && (
                                  <div className="mt-2.5 p-2.5 rounded bg-indigo-500/5 border border-indigo-500/10 text-[11px] text-indigo-300 space-y-1">
                                    <p className="font-semibold text-indigo-200 tracking-wider uppercase text-[8px]">POD Specifications</p>
                                    {Object.entries(item.pod_customization).map(([k, v]: [string, any]) => (
                                      <div key={k} className="flex justify-between items-start gap-2">
                                        <span className="text-zinc-500 capitalize">{k.replace('_', ' ')}:</span>
                                        {typeof v === 'string' && v.startsWith('http') ? (
                                          <a href={v} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline flex items-center gap-1 shrink-0 font-bold font-mono">
                                            View Design <ExternalLink className="w-2.5 h-2.5" />
                                          </a>
                                        ) : (
                                          <span className="text-indigo-300 font-medium truncate max-w-[120px]">{String(v)}</span>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PRODUCTS CATALOG */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              {/* Product search bar */}
              <div className="relative">
                <Search className="absolute top-1/2 left-4 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search products by title or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {filteredProducts.length === 0 ? (
                <div className="py-16 text-center border border-dashed border-zinc-900 rounded-2xl bg-zinc-950/20">
                  <Package className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                  <p className="text-white font-medium">No products found</p>
                  <p className="text-zinc-500 text-xs mt-1">Try refining your search query or add a new product listing.</p>
                </div>
              ) : (
                <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-zinc-900 text-zinc-500 text-xs uppercase tracking-wider font-bold">
                          <th className="px-6 py-4.5">Product</th>
                          <th className="px-6 py-4.5">Category</th>
                          <th className="px-6 py-4.5">Base Price</th>
                          <th className="px-6 py-4.5">Custom (POD)</th>
                          <th className="px-6 py-4.5">Photos Count</th>
                          <th className="px-6 py-4.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-900/60">
                        {filteredProducts.map((product) => (
                          <tr key={product.id} className="hover:bg-zinc-900/10 text-zinc-300">
                            
                            {/* Product Info with Image */}
                            <td className="px-6 py-4 flex items-center gap-4">
                              <div className="relative w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden shrink-0">
                                {product.image_url ? (
                                  <Image
                                    src={product.image_url}
                                    alt={product.title}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-zinc-700 text-xs">Shoe</div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <span className="text-white font-semibold truncate block max-w-[200px]" title={product.title}>
                                  {product.title}
                                </span>
                                <span className="text-zinc-500 text-xs mt-0.5 truncate block max-w-[200px]" title={product.description || ''}>
                                  {product.description || 'No description'}
                                </span>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="px-6 py-4">
                              <span className="text-zinc-400 font-medium">
                                {product.category || 'Uncategorized'}
                              </span>
                            </td>

                            {/* Base Price */}
                            <td className="px-6 py-4 font-mono font-bold text-zinc-300">
                              Rs {product.base_price.toLocaleString('en-PK')}
                            </td>

                            {/* POD toggle status badge */}
                            <td className="px-6 py-4">
                              {product.is_pod ? (
                                <span className="inline-flex px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold text-[10px] uppercase tracking-wider">
                                  POD Enabled
                                </span>
                              ) : (
                                <span className="inline-flex px-2 py-0.5 rounded-full bg-zinc-850 border border-zinc-800 text-zinc-500 text-[10px] uppercase tracking-wider font-bold">
                                  Standard
                                </span>
                              )}
                            </td>

                            {/* Photos Count */}
                            <td className="px-6 py-4 font-mono text-zinc-400">
                              {product.images ? product.images.length : (product.image_url ? 1 : 0)}
                            </td>

                            {/* Action links */}
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                <Link
                                  href={`/admin/products/${product.id}/edit`}
                                  className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-all"
                                  title="Edit Product"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </Link>
                                <button
                                  onClick={() => setProductToDelete(product.id)}
                                  className="p-2 bg-zinc-900 border border-zinc-800 text-red-400/70 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-all"
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>

                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CATEGORIES MANAGER */}
          {activeTab === 'categories' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Form card to add a new category */}
              <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-xl space-y-4 self-start">
                <div>
                  <h3 className="text-white font-bold text-lg">Add New Category</h3>
                  <p className="text-zinc-500 text-xs mt-1">Create unique categories to dynamically populate storefront and upload widget forms.</p>
                </div>

                <form onSubmit={handleAddCategory} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider block">Category Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vintage High-Tops"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isPending || !newCatName.trim()}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900 disabled:text-indigo-700 text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Save Category
                  </button>
                </form>
              </div>

              {/* Categories list table */}
              <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden shadow-xl md:col-span-2">
                <div className="px-6 py-5 border-b border-zinc-900">
                  <h3 className="text-white font-bold text-lg">Available Categories</h3>
                </div>

                {categories.length === 0 ? (
                  <div className="py-12 text-center text-zinc-600">
                    <Layers className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
                    <p className="text-sm">No categories saved yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-zinc-900/60 max-h-[480px] overflow-y-auto">
                    {categories.map((cat) => (
                      <div key={cat.id} className="flex justify-between items-center px-6 py-4 hover:bg-zinc-900/10 text-zinc-300">
                        <span className="font-semibold text-white truncate max-w-[280px]" title={cat.name}>
                          {cat.name}
                        </span>
                        
                        {/* Only allow deleting if not standard system categories, or display all but let them delete */}
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="p-2.5 bg-zinc-900 border border-zinc-800 text-red-400/70 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-all"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      )}

      {/* ─── MODAL CONFIRMATION DIALOGS ─── */}
      <AnimatePresence>
        {/* Delete product confirmation modal */}
        {productToDelete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-955 border border-zinc-900 w-full max-w-md p-6 rounded-2xl space-y-6 shadow-2xl bg-[#09090b]"
            >
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center shrink-0 border border-red-500/10">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Archive Product?</h3>
                  <p className="text-zinc-400 text-sm mt-1 leading-relaxed">
                    Are you sure you want to remove this product from your storefront? 
                    This will soft-delete the product so that past order histories remain intact.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setProductToDelete(null)}
                  className="px-4.5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl text-sm font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteProduct(productToDelete)}
                  disabled={isPending}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-500 disabled:bg-red-900/30 text-white rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5"
                >
                  {isPending ? 'Archiving...' : 'Confirm Archive'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
