import React, { useState, useEffect } from 'react';
import {
  getSavedAddresses,
  saveAddress,
  deleteAddress,
  setDefaultAddress,
  getCurrentLocationAddress,
  lookupPincode,
} from '../utils/addressUtils';

export default function AddressManager({ selectedAddressId, onSelectAddress, compactMode = false }) {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [locating, setLocating] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });

  const initialForm = {
    id: '',
    fullName: '',
    mobile: '',
    altMobile: '',
    pincode: '',
    address: '',
    area: '',
    landmark: '',
    city: '',
    state: '',
    type: 'HOME',
    isDefault: false,
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    const list = getSavedAddresses();
    setAddresses(list);
    if (!selectedAddressId && list.length > 0) {
      const defaultAddr = list.find((a) => a.isDefault) || list[0];
      if (defaultAddr && onSelectAddress) {
        onSelectAddress(defaultAddr);
      }
    }
  }, []);

  const showNotification = (text, type = 'info') => {
    setStatusMsg({ text, type });
    setTimeout(() => setStatusMsg({ text: '', type: '' }), 4500);
  };

  // Handle GPS location auto-detection with real street address mapping
  const handleUseCurrentLocation = async () => {
    try {
      setLocating(true);
      setStatusMsg({ text: '📍 Fetching precise real-time GPS location...', type: 'info' });
      const detected = await getCurrentLocationAddress();
      
      const newLiveAddr = {
        fullName: formData.fullName || 'Anuj Bhaskar',
        mobile: formData.mobile || '9876543210',
        altMobile: formData.altMobile || '',
        address: detected.address || 'Real Time Location Area',
        area: detected.area || 'Current Geolocation',
        landmark: 'GPS Auto-Detected',
        city: detected.city || 'Bengaluru',
        state: detected.state || 'Karnataka',
        pincode: detected.pincode || '560103',
        type: 'HOME',
        isDefault: true,
      };

      // Auto-save and select immediately
      const { addresses: updated, saved } = saveAddress(newLiveAddr);
      setAddresses(updated);
      if (onSelectAddress) {
        onSelectAddress(saved);
      }

      setFormData(newLiveAddr);
      setShowForm(false);
      showNotification(`✅ Real-time location detected & set: ${detected.city}, ${detected.state} (${detected.pincode})`, 'success');
    } catch (err) {
      console.error(err);
      showNotification(err.message || 'Could not fetch live location. Please enter manually.', 'error');
    } finally {
      setLocating(false);
    }
  };

  // Handle PIN code live lookup
  const handlePincodeChange = async (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setFormData((prev) => ({ ...prev, pincode: val }));

    if (val.length === 6) {
      setPincodeLoading(true);
      try {
        const info = await lookupPincode(val);
        if (info && info.success) {
          setFormData((prev) => ({
            ...prev,
            city: info.city || prev.city,
            state: info.state || prev.state,
          }));
          showNotification(`📍 PIN ${val} mapped to ${info.city}, ${info.state}`, 'success');
        } else {
          showNotification(`Could not auto-resolve PIN ${val}. Please enter City & State.`, 'info');
        }
      } catch (err) {
        console.warn(err);
      } finally {
        setPincodeLoading(false);
      }
    }
  };

  const handleEditClick = (addr, e) => {
    e.stopPropagation();
    setFormData(addr);
    setEditingId(addr.id);
    setShowForm(true);
  };

  const handleDeleteClick = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this delivery address?')) {
      const updated = deleteAddress(id);
      setAddresses(updated);
      if (selectedAddressId === id && updated.length > 0) {
        onSelectAddress(updated[0]);
      }
      showNotification('Address removed successfully', 'info');
    }
  };

  const handleSetDefault = (id, e) => {
    e.stopPropagation();
    const updated = setDefaultAddress(id);
    setAddresses(updated);
    const curr = updated.find((a) => a.id === id);
    if (curr && onSelectAddress) onSelectAddress(curr);
    showNotification('Default delivery address updated', 'success');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      showNotification('Please enter recipient full name', 'error');
      return;
    }
    if (!formData.mobile.trim() || formData.mobile.length < 10) {
      showNotification('Please enter a valid 10-digit mobile number', 'error');
      return;
    }
    if (!formData.pincode.trim() || formData.pincode.length < 6) {
      showNotification('Please enter a 6-digit PIN code', 'error');
      return;
    }
    if (!formData.address.trim()) {
      showNotification('Please enter flat/house and street address', 'error');
      return;
    }
    if (!formData.city.trim() || !formData.state.trim()) {
      showNotification('Please enter City and State', 'error');
      return;
    }

    const { addresses: updated, saved } = saveAddress(formData);
    setAddresses(updated);
    if (onSelectAddress) {
      onSelectAddress(saved);
    }

    setShowForm(false);
    setEditingId(null);
    setFormData(initialForm);
    showNotification('🎉 Delivery address saved successfully!', 'success');
  };

  return (
    <div className="space-y-4">
      {/* Toast / Status banner */}
      {statusMsg.text && (
        <div
          className={`p-3 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : statusMsg.type === 'error'
              ? 'bg-rose-50 text-rose-800 border border-rose-200'
              : 'bg-blue-50 text-blue-800 border border-blue-200'
          }`}
        >
          <span>{statusMsg.text}</span>
          <button
            type="button"
            onClick={() => setStatusMsg({ text: '', type: '' })}
            className="text-slate-400 hover:text-slate-700 ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
        <div>
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
            Select Delivery Address
          </h4>
          <p className="text-[11px] text-slate-500 font-medium">
            Orders will be delivered safely to the selected address
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={locating}
            onClick={handleUseCurrentLocation}
            className="px-3 py-1.5 rounded-lg border border-[#2874f0] bg-blue-50/50 hover:bg-blue-100/70 text-[#2874f0] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Auto-detect current location via GPS"
          >
            <span>{locating ? '⏳' : '📍'}</span>
            <span>{locating ? 'Locating...' : 'Use Current Location'}</span>
          </button>

          {!showForm && (
            <button
              type="button"
              onClick={() => {
                setFormData(initialForm);
                setEditingId(null);
                setShowForm(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-[#2874f0] hover:bg-[#1f5cc0] text-white text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer"
            >
              <span>+</span>
              <span>Add New</span>
            </button>
          )}
        </div>
      </div>

      {/* SAVED ADDRESS CARDS LIST */}
      {!showForm && (
        <div className="space-y-3">
          {addresses.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-6 space-y-3">
              <div className="text-3xl">🏠</div>
              <p className="text-xs font-bold text-slate-600">No delivery address saved yet.</p>
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="px-4 py-2 bg-[#2874f0] text-white text-xs font-black rounded-xl shadow-xs hover:bg-blue-700 transition cursor-pointer"
              >
                + Add Your Delivery Address
              </button>
            </div>
          ) : (
            addresses.map((addr) => {
              const isSelected = selectedAddressId === addr.id;
              return (
                <div
                  key={addr.id}
                  onClick={() => onSelectAddress && onSelectAddress(addr)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-[#2874f0] bg-blue-50/30 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {/* Radio dot */}
                      <div
                        className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'border-[#2874f0] bg-[#2874f0]'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-black text-slate-900">
                            {addr.fullName}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                              addr.type === 'HOME'
                                ? 'bg-emerald-100 text-emerald-800'
                                : addr.type === 'WORK'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-slate-100 text-slate-800'
                            }`}
                          >
                            {addr.type || 'HOME'}
                          </span>
                          <span className="text-xs font-bold text-slate-700">
                            +91 {addr.mobile}
                          </span>
                          {addr.isDefault && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-black">
                              DEFAULT
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 font-medium leading-relaxed">
                          {addr.address}
                          {addr.area ? `, ${addr.area}` : ''}
                          {addr.landmark ? ` (Landmark: ${addr.landmark})` : ''}
                          <br />
                          <span className="font-bold text-slate-800">
                            {addr.city}, {addr.state} - {addr.pincode}
                          </span>
                        </p>

                        {addr.altMobile && (
                          <p className="text-[11px] text-slate-500 font-medium">
                            Alt phone: +91 {addr.altMobile}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions Menu */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => handleEditClick(addr, e)}
                        className="text-xs font-bold text-[#2874f0] hover:underline p-1 cursor-pointer"
                      >
                        EDIT
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteClick(addr.id, e)}
                        className="text-xs font-bold text-rose-600 hover:underline p-1 cursor-pointer"
                      >
                        DELETE
                      </button>
                    </div>
                  </div>

                  {/* Delivery Here CTA button for non-selected or mobile */}
                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-blue-100 flex items-center justify-between text-xs">
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        ✓ Selected for this order
                      </span>
                      {!addr.isDefault && (
                        <button
                          type="button"
                          onClick={(e) => handleSetDefault(addr.id, e)}
                          className="text-[11px] text-slate-500 hover:text-slate-800 font-semibold"
                        >
                          Set as Default
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ADD / EDIT ADDRESS FORM */}
      {showForm && (
        <form
          onSubmit={handleFormSubmit}
          className="p-5 bg-white rounded-2xl border border-blue-200 shadow-sm space-y-4 animate-slide-down"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span>{editingId ? '✏️ Edit Address' : '📍 Add New Delivery Address'}</span>
            </h4>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Anuj Bhaskar"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                10-digit Mobile Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex">
                <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 text-slate-600 text-xs font-bold">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  placeholder="9876543210"
                  maxLength={10}
                  value={formData.mobile}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mobile: e.target.value.replace(/\D/g, '').slice(0, 10),
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-r-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                PIN Code <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="6-digit PIN (e.g. 560103)"
                  maxLength={6}
                  value={formData.pincode}
                  onChange={handlePincodeChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
                />
                {pincodeLoading && (
                  <span className="absolute right-2.5 top-2 text-xs">⏳</span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                City / District <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Bengaluru"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                State <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Karnataka"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Flat, House No., Building, Company, Apartment <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Flat 402, Tower 3, Sunshine Heights"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Area, Street, Sector, Village
              </label>
              <input
                type="text"
                placeholder="e.g. Outer Ring Road, Kadubeesanahalli"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Landmark (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Near Cisco Main Gate"
                value={formData.landmark}
                onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Address Type
              </label>
              <div className="flex gap-2">
                {['HOME', 'WORK', 'OTHER'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, type })}
                    className={`flex-1 py-2 rounded-xl text-xs font-black transition cursor-pointer border ${
                      formData.type === type
                        ? 'border-[#2874f0] bg-blue-50 text-[#2874f0]'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {type === 'HOME' ? '🏠 Home' : type === 'WORK' ? '💼 Work' : '📍 Other'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Alternate Phone (Optional)
              </label>
              <input
                type="tel"
                placeholder="Optional 10-digit mobile"
                maxLength={10}
                value={formData.altMobile}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    altMobile: e.target.value.replace(/\D/g, '').slice(0, 10),
                  })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isDefault"
              checked={formData.isDefault}
              onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
              className="w-4 h-4 text-[#2874f0] rounded border-slate-300 focus:ring-[#2874f0] cursor-pointer"
            />
            <label htmlFor="isDefault" className="text-xs font-semibold text-slate-700 cursor-pointer">
              Make this my default delivery address
            </label>
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-[#fb641b] hover:bg-[#eb5a14] active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-xs transition cursor-pointer"
            >
              {editingId ? 'Update & Deliver Here' : 'Save & Deliver Here'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="px-4 py-2.5 border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
