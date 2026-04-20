import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Download,
  Share2,
  Calendar,
  Tag,
  DollarSign,
  Percent,
  MapPin,
  FileText,
  CheckCircle,
  CreditCard,
  Building2,
  Save,
  XCircle,
} from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Badge from 'components/ui/Badge';
import { PROVINCES, calculateTax, getTaxRateDisplay } from 'constants/provinces';

const CATEGORY_OPTIONS = [
  'Fuel',
  'Maintenance',
  'Insurance',
  'Parking / Tolls',
  'Mobile / Internet',
  'Supplies',
  'Equipment',
  'Meals',
  'Home Office',
  'Rent / Utilities',
  'Vehicle Expenses',
  'Vehicle Bill of Sale',
  'Professional Fees',
  'Other',
];

const PAYMENT_OPTIONS = ['Credit Card', 'Debit Card', 'Cash', 'Cheque', 'E-Transfer'];

const ReceiptDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [receipt, setReceipt] = useState({
    id,
    vendor: 'Shell',
    amount: 45.23,
    date: '2026-03-15',
    category: 'Fuel',
    categoryKey: 'fuel',
    province: 'AB',
    gst: 2.26,
    pst: 0,
    hst: 0,
    qst: 0,
    total: 47.49,
    paymentMethod: 'Credit Card',
    notes: 'Fuel uploaded for tax support.',
    status: 'verified',
    imageUrl: 'https://placehold.co/1000x1400/f8fafc/334155?text=Receipt+Preview',
    merchantAddress: '123 Main St, Edmonton, AB',
    merchantNumber: '123456789',
    uploadedAt: '2026-03-15',

    // vehicle purchase fields
    purchaseType: 'Financed',
    vin: '',
    businessUsePercent: '',
  });

  const taxDetails = useMemo(() => {
    return calculateTax(Number(receipt.amount || 0), receipt.province);
  }, [receipt.amount, receipt.province]);

  const provinceInfo = useMemo(() => {
    return PROVINCES.find((p) => p.id === receipt.province);
  }, [receipt.province]);

  const isVehiclePurchase =
    receipt.categoryKey === 'vehicle_purchase' ||
    receipt.category === 'Vehicle Bill of Sale' ||
    receipt.category === 'vehicle_purchase';

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this receipt?')) {
      navigate('/receipts');
    }
  };

  const handleFieldChange = (key, value) => {
    setReceipt((prev) => {
      const updated = { ...prev, [key]: value };

      if (key === 'category') {
        if (value === 'Vehicle Bill of Sale') {
          updated.categoryKey = 'vehicle_purchase';
        } else if (value === 'Vehicle Expenses') {
          updated.categoryKey = 'vehicle_expenses';
        } else if (value === 'Parking / Tolls') {
          updated.categoryKey = 'parking_tolls';
        } else if (value === 'Mobile / Internet') {
          updated.categoryKey = 'mobile_internet';
        } else if (value === 'Home Office') {
          updated.categoryKey = 'home_office';
        } else if (value === 'Rent / Utilities') {
          updated.categoryKey = 'rent_utilities';
        } else if (value === 'Professional Fees') {
          updated.categoryKey = 'professional_fees';
        } else {
          updated.categoryKey = String(value || '')
            .trim()
            .toLowerCase()
            .replace(/\s*\/\s*/g, '_')
            .replace(/\s+/g, '_');
        }
      }

      if (key === 'amount' || key === 'province') {
        const numericAmount =
          key === 'amount' ? Number(value || 0) : Number(updated.amount || 0);
        const province = key === 'province' ? value : updated.province;
        const nextTax = calculateTax(numericAmount, province);

        updated.gst = nextTax.gst || 0;
        updated.pst = nextTax.pst || 0;
        updated.hst = nextTax.hst || 0;
        updated.qst = nextTax.qst || 0;
        updated.total = Number(
          (
            numericAmount +
            (nextTax.gst || 0) +
            (nextTax.pst || 0) +
            (nextTax.hst || 0) +
            (nextTax.qst || 0)
          ).toFixed(2)
        );
      }

      return updated;
    });
  };

  const DetailRow = ({ icon: Icon, label, children }) => (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <div className="mb-2 flex items-center text-gray-500">
        <Icon size={16} className="mr-2" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      {children}
    </div>
  );

  const StatCard = ({ label, value, valueClassName = 'text-gray-900' }) => (
    <Card>
      <Card.Body>
        <p className="text-sm text-gray-500">{label}</p>
        <p className={`mt-1 text-2xl font-bold ${valueClassName}`}>{value}</p>
      </Card.Body>
    </Card>
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate('/receipts')}
            className="inline-flex items-center text-sm font-medium text-gray-600 transition hover:text-primary-600"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Receipts
          </button>

          <div className="mt-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-400">
              Receipt Details
            </p>
            <h1 className="mt-1 text-3xl font-bold text-gray-900">{receipt.vendor}</h1>
            <p className="mt-2 text-sm text-gray-500">
              Uploaded on {formatDate(receipt.uploadedAt)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <XCircle size={16} className="mr-2" />
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setIsEditing(false)}>
                <Save size={16} className="mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit size={16} className="mr-2" />
                Edit Receipt
              </Button>
              <Button variant="warning" onClick={handleDelete}>
                <Trash2 size={16} className="mr-2" />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard
          label="Amount"
          value={`$${Number(receipt.amount).toFixed(2)}`}
          valueClassName="text-gray-900"
        />
        <StatCard
          label="GST/HST"
          value={`$${Number(receipt.gst + receipt.hst).toFixed(2)}`}
          valueClassName="text-blue-600"
        />
        <StatCard
          label="Total"
          value={`$${Number(receipt.total).toFixed(2)}`}
          valueClassName="text-green-600"
        />
        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">Status</p>
            <div className="mt-2">
              <Badge variant={receipt.status === 'verified' ? 'success' : 'warning'}>
                {receipt.status}
              </Badge>
            </div>
          </Card.Body>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden">
          <Card.Header className="border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Uploaded Receipt</h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-xl border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-50 hover:text-gray-700"
                >
                  <Download size={18} />
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-50 hover:text-gray-700"
                >
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          </Card.Header>

          <Card.Body className="bg-gray-50 p-5">
            <div className="flex min-h-[500px] items-center justify-center overflow-hidden rounded-2xl border border-dashed border-gray-200 bg-white">
              <img
                src={receipt.imageUrl}
                alt="Receipt"
                className="max-h-[80vh] w-full object-contain"
              />
            </div>
          </Card.Body>
        </Card>

        <div className="space-y-6">
          <Card>
            <Card.Header className="border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Receipt Information</h3>
            </Card.Header>

            <Card.Body className="space-y-4">
              <DetailRow icon={Building2} label="Vendor">
                {isEditing ? (
                  <input
                    type="text"
                    value={receipt.vendor}
                    onChange={(e) => handleFieldChange('vendor', e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                ) : (
                  <p className="font-semibold text-gray-900">{receipt.vendor}</p>
                )}
              </DetailRow>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <DetailRow icon={DollarSign} label="Amount">
                  {isEditing ? (
                    <input
                      type="number"
                      step="0.01"
                      value={receipt.amount}
                      onChange={(e) => handleFieldChange('amount', e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  ) : (
                    <p className="font-semibold text-gray-900">
                      ${Number(receipt.amount).toFixed(2)}
                    </p>
                  )}
                </DetailRow>

                <DetailRow icon={Calendar} label="Date">
                  {isEditing ? (
                    <input
                      type="date"
                      value={receipt.date}
                      onChange={(e) => handleFieldChange('date', e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  ) : (
                    <p className="font-semibold text-gray-900">{formatDate(receipt.date)}</p>
                  )}
                </DetailRow>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <DetailRow icon={Tag} label="Category">
                  {isEditing ? (
                    <select
                      value={receipt.category}
                      onChange={(e) => handleFieldChange('category', e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {CATEGORY_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="font-semibold text-gray-900">{receipt.category}</p>
                  )}
                </DetailRow>

                <DetailRow icon={CreditCard} label="Payment Method">
                  {isEditing ? (
                    <select
                      value={receipt.paymentMethod}
                      onChange={(e) => handleFieldChange('paymentMethod', e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {PAYMENT_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="font-semibold text-gray-900">{receipt.paymentMethod}</p>
                  )}
                </DetailRow>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <DetailRow icon={MapPin} label="Province">
                  {isEditing ? (
                    <select
                      value={receipt.province}
                      onChange={(e) => handleFieldChange('province', e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {PROVINCES.map((province) => (
                        <option key={province.id} value={province.id}>
                          {province.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <>
                      <p className="font-semibold text-gray-900">
                        {provinceInfo?.name || receipt.province}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {getTaxRateDisplay(receipt.province)}
                      </p>
                    </>
                  )}
                </DetailRow>

                <DetailRow icon={Percent} label="Tax Breakdown">
                  <div className="space-y-1 text-sm text-gray-700">
                    {taxDetails.gst > 0 && <p>GST: ${Number(taxDetails.gst).toFixed(2)}</p>}
                    {taxDetails.pst > 0 && <p>PST: ${Number(taxDetails.pst).toFixed(2)}</p>}
                    {taxDetails.hst > 0 && <p>HST: ${Number(taxDetails.hst).toFixed(2)}</p>}
                    {taxDetails.qst > 0 && <p>QST: ${Number(taxDetails.qst).toFixed(2)}</p>}
                    {taxDetails.gst === 0 &&
                      taxDetails.pst === 0 &&
                      taxDetails.hst === 0 &&
                      taxDetails.qst === 0 && <p>No tax calculated</p>}
                  </div>
                </DetailRow>
              </div>

              <DetailRow icon={FileText} label="Notes">
                {isEditing ? (
                  <textarea
                    rows="4"
                    value={receipt.notes}
                    onChange={(e) => handleFieldChange('notes', e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                ) : (
                  <p className="leading-6 text-gray-700">
                    {receipt.notes || 'No notes added.'}
                  </p>
                )}
              </DetailRow>
            </Card.Body>
          </Card>

          {isVehiclePurchase && (
            <Card>
              <Card.Header className="border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Vehicle Purchase Details</h3>
              </Card.Header>

              <Card.Body>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <DetailRow icon={Tag} label="Purchase Type">
                    {isEditing ? (
                      <select
                        value={receipt.purchaseType || 'Financed'}
                        onChange={(e) => handleFieldChange('purchaseType', e.target.value)}
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="Owned">Owned</option>
                        <option value="Financed">Financed</option>
                        <option value="Leased">Leased</option>
                      </select>
                    ) : (
                      <p className="font-medium text-gray-900">
                        {receipt.purchaseType || 'Financed'}
                      </p>
                    )}
                  </DetailRow>

                  <DetailRow icon={Calendar} label="Purchase Date">
                    <p className="font-medium text-gray-900">{formatDate(receipt.date)}</p>
                  </DetailRow>

                  <DetailRow icon={FileText} label="VIN">
                    {isEditing ? (
                      <input
                        type="text"
                        value={receipt.vin || ''}
                        onChange={(e) => handleFieldChange('vin', e.target.value)}
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter VIN"
                      />
                    ) : (
                      <p className="font-medium text-gray-900">{receipt.vin || '—'}</p>
                    )}
                  </DetailRow>

                  <DetailRow icon={Percent} label="Business / Gig Use %">
                    {isEditing ? (
                      <input
                        type="text"
                        value={receipt.businessUsePercent || ''}
                        onChange={(e) =>
                          handleFieldChange('businessUsePercent', e.target.value)
                        }
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="To be confirmed"
                      />
                    ) : (
                      <p className="font-medium text-gray-900">
                        {receipt.businessUsePercent || 'To be confirmed'}
                      </p>
                    )}
                  </DetailRow>

                  <DetailRow icon={DollarSign} label="Purchase Price">
                    <p className="font-medium text-gray-900">
                      ${Number(receipt.amount || 0).toLocaleString('en-CA')}
                    </p>
                  </DetailRow>

                  <DetailRow icon={Percent} label="GST / HST">
                    <p className="font-medium text-gray-900">
                      ${Number((receipt.gst || 0) + (receipt.hst || 0)).toLocaleString('en-CA')}
                    </p>
                  </DetailRow>
                </div>
              </Card.Body>
            </Card>
          )}

          <Card>
            <Card.Header className="border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Merchant Information</h3>
            </Card.Header>

            <Card.Body className="space-y-4">
              <DetailRow icon={MapPin} label="Merchant Address">
                {isEditing ? (
                  <input
                    type="text"
                    value={receipt.merchantAddress}
                    onChange={(e) => handleFieldChange('merchantAddress', e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                ) : (
                  <p className="text-gray-800">{receipt.merchantAddress}</p>
                )}
              </DetailRow>

              <DetailRow icon={CheckCircle} label="Merchant Number">
                {isEditing ? (
                  <input
                    type="text"
                    value={receipt.merchantNumber}
                    onChange={(e) => handleFieldChange('merchantNumber', e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                ) : (
                  <p className="text-gray-800">{receipt.merchantNumber}</p>
                )}
              </DetailRow>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReceiptDetail;
