import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  DollarSign,
  Calendar
} from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import Badge from 'components/ui/Badge';
import { PROVINCES } from 'constants/provinces';

const BusinessInventory = () => {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [province, setProvince] = useState('ON');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const years = [2024, 2023, 2022, 2021];

  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'grocery', name: 'Grocery' },
    { id: 'beverages', name: 'Beverages' },
    { id: 'snacks', name: 'Snacks' },
    { id: 'household', name: 'Household' },
    { id: 'supplies', name: 'Supplies' }
  ];

  const [inventory, setInventory] = useState([
    {
      id: 1,
      name: 'Soft Drinks',
      category: 'beverages',
      sku: 'BEV-001',
      quantity: 250,
      unit: 'units',
      costPrice: 1.25,
      sellingPrice: 2.49,
      supplier: 'Coca-Cola',
      lastOrdered: '2024-03-10',
      reorderLevel: 50,
      documents: {
        invoices: 'uploaded',
        receipts: 'uploaded'
      },
      status: 'active'
    },
    {
      id: 2,
      name: 'Potato Chips',
      category: 'snacks',
      sku: 'SNK-001',
      quantity: 180,
      unit: 'units',
      costPrice: 1.75,
      sellingPrice: 3.29,
      supplier: 'Lays',
      lastOrdered: '2024-03-08',
      reorderLevel: 40,
      documents: {
        invoices: 'uploaded',
        receipts: 'pending'
      },
      status: 'active'
    },
    {
      id: 3,
      name: 'Milk (2L)',
      category: 'grocery',
      sku: 'GRC-001',
      quantity: 45,
      unit: 'units',
      costPrice: 3.50,
      sellingPrice: 4.99,
      supplier: 'Neilson',
      lastOrdered: '2024-03-12',
      reorderLevel: 30,
      documents: {
        invoices: 'uploaded',
        receipts: 'uploaded'
      },
      status: 'active'
    },
    {
      id: 4,
      name: 'Bread',
      category: 'grocery',
      sku: 'GRC-002',
      quantity: 15,
      unit: 'units',
      costPrice: 1.80,
      sellingPrice: 3.29,
      supplier: 'Wonder Bread',
      lastOrdered: '2024-03-09',
      reorderLevel: 20,
      documents: {
        invoices: 'uploaded',
        receipts: 'missing'
      },
      status: 'low'
    },
    {
      id: 5,
      name: 'Cleaning Supplies',
      category: 'household',
      sku: 'HHLD-001',
      quantity: 5,
      unit: 'units',
      costPrice: 4.25,
      sellingPrice: 7.99,
      supplier: 'Clorox',
      lastOrdered: '2024-02-15',
      reorderLevel: 10,
      documents: {
        invoices: 'pending',
        receipts: 'pending'
      },
      status: 'critical'
    }
  ]);

  const [purchases, setPurchases] = useState([
    {
      id: 1,
      date: '2024-03-10',
      supplier: 'Coca-Cola',
      items: 50,
      total: 62.50,
      receipt: 'uploaded'
    },
    {
      id: 2,
      date: '2024-03-08',
      supplier: 'Lays',
      items: 30,
      total: 52.50,
      receipt: 'uploaded'
    },
    {
      id: 3,
      date: '2024-03-05',
      supplier: 'Neilson',
      items: 25,
      total: 87.50,
      receipt: 'pending'
    }
  ]);

  const provinceInfo = PROVINCES.find(p => p.id === province);

  const calculateCOGS = () => {
    // Simplified COGS calculation
    const totalPurchases = purchases.reduce((sum, p) => sum + p.total, 0);
    const beginningInventory = 35000; // Mock value
    const endingInventory = inventory.reduce((sum, item) => sum + (item.quantity * item.costPrice), 0);
    const cogs = beginningInventory + totalPurchases - endingInventory;
    
    return {
      beginningInventory,
      purchases: totalPurchases,
      endingInventory,
      cogs
    };
  };

  const cogs = calculateCOGS();

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'low': return 'warning';
      case 'critical': return 'error';
      default: return 'info';
    }
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory & COGS</h1>
          <p className="text-gray-500 mt-1">Track inventory, purchases, and cost of goods sold</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => setShowAddModal(true)}>
            <Plus size={16} className="mr-2" />
            Add Item
          </Button>
          <Button variant="primary">
            <Download size={16} className="mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Year and Province Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {years.map(year => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedYear === year
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
        <select
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {PROVINCES.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* COGS Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">Beginning Inventory</p>
            <p className="text-2xl font-bold text-primary-600">
              ${cogs.beginningInventory.toLocaleString()}
            </p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">Purchases (YTD)</p>
            <p className="text-2xl font-bold text-success-600">
              ${cogs.purchases.toLocaleString()}
            </p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">Ending Inventory</p>
            <p className="text-2xl font-bold text-warning-600">
              ${cogs.endingInventory.toLocaleString()}
            </p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">Cost of Goods Sold</p>
            <p className="text-2xl font-bold text-info-600">
              ${cogs.cogs.toLocaleString()}
            </p>
          </Card.Body>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <Card.Body>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search inventory by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </Card.Body>
      </Card>

      {/* Inventory Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">Total Items</p>
            <p className="text-2xl font-bold">{inventory.length}</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">Low Stock Items</p>
            <p className="text-2xl font-bold text-warning-600">
              {inventory.filter(i => i.status === 'low' || i.status === 'critical').length}
            </p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">Inventory Value</p>
            <p className="text-2xl font-bold text-success-600">
              ${cogs.endingInventory.toLocaleString()}
            </p>
          </Card.Body>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card>
        <Card.Header>
          <h3 className="font-semibold">Current Inventory</h3>
        </Card.Header>
        <Card.Body>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cost Price</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Selling Price</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Value</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Docs</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInventory.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.category}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{item.sku}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={item.quantity <= item.reorderLevel ? 'text-warning-600 font-semibold' : ''}>
                        {item.quantity} {item.unit}
                      </span>
                      {item.quantity <= item.reorderLevel && (
                        <p className="text-xs text-warning-600">Reorder at {item.reorderLevel}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">${item.costPrice.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">${item.sellingPrice.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right font-semibold">
                      ${(item.quantity * item.costPrice).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center space-x-1">
                        {Object.entries(item.documents).map(([doc, status]) => (
                          <div key={doc} className="relative group">
                            {status === 'uploaded' ? (
                              <CheckCircle size={16} className="text-success-500" />
                            ) : (
                              <AlertCircle size={16} className="text-warning-500" />
                            )}
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 mb-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              {doc}: {status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center space-x-2">
                        <button className="text-gray-400 hover:text-primary-500">
                          <Edit size={16} />
                        </button>
                        <button className="text-gray-400 hover:text-red-500">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>

      {/* Recent Purchases */}
      <Card>
        <Card.Header>
          <h3 className="font-semibold">Recent Purchases</h3>
        </Card.Header>
        <Card.Body>
          <div className="space-y-3">
            {purchases.map(purchase => (
              <div key={purchase.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <Calendar size={16} className="text-gray-400" />
                  <div>
                    <p className="font-medium">{purchase.supplier}</p>
                    <p className="text-sm text-gray-500">{purchase.date} • {purchase.items} items</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-semibold">${purchase.total.toFixed(2)}</span>
                  {purchase.receipt === 'uploaded' ? (
                    <button className="text-primary-600 hover:underline text-sm">View</button>
                  ) : (
                    <button className="text-primary-600 hover:underline text-sm flex items-center">
                      <Upload size={14} className="mr-1" />
                      Upload
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* CRA Info */}
      <Card className="bg-info-50 border-info-200">
        <Card.Body>
          <div className="flex items-start">
            <AlertCircle className="text-info-600 mr-3 flex-shrink-0 mt-1" size={20} />
            <div>
              <h4 className="font-medium text-info-700">Inventory & COGS Requirements</h4>
              <p className="text-sm text-info-600 mt-1">
                • Keep all purchase invoices and receipts for 6 years
                • Conduct physical inventory count at year-end
                • COGS calculation: Beginning Inventory + Purchases - Ending Inventory
                • Capital assets (over $500) must be depreciated separately
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Add Item Modal - Simplified */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-2xl w-full">
            <Card.Header>
              <h3 className="font-semibold">Add Inventory Item</h3>
            </Card.Header>
            <Card.Body className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Item Name" placeholder="e.g., Soft Drinks" />
                <Input label="SKU" placeholder="BEV-001" />
                <select className="px-4 py-2 border border-gray-300 rounded-lg">
                  <option>Select Category</option>
                  <option>Grocery</option>
                  <option>Beverages</option>
                  <option>Snacks</option>
                  <option>Household</option>
                </select>
                <Input label="Supplier" placeholder="e.g., Coca-Cola" />
                <Input label="Quantity" type="number" placeholder="0" />
                <Input label="Unit" placeholder="e.g., units, kg, L" />
                <Input label="Cost Price ($)" type="number" step="0.01" placeholder="0.00" />
                <Input label="Selling Price ($)" type="number" step="0.01" placeholder="0.00" />
                <Input label="Reorder Level" type="number" placeholder="0" />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => setShowAddModal(false)} className="flex-1">
                  Add Item
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BusinessInventory;







