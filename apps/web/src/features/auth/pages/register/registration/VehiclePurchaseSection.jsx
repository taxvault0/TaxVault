import React from 'react';
import {
  VEHICLE_OWNERSHIP_OPTIONS,
  getAvailableVehicleOwners,
  getAvailableVehicleUses,
} from '../modules';

const inputClasses =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100';

const RegisterVehiclePurchaseSection = ({
  formData,
  errors,
  handleVehicleChange,
}) => {
  const vehicle = formData.vehicleInfo;

  if (!vehicle.hasVehiclePurchase) return null;

  const ownerOptions = getAvailableVehicleOwners(formData);
  const useOptions = getAvailableVehicleUses(formData);

  return (
    <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">Vehicle Purchase Info</h3>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700">Who bought the vehicle?</label>
          <select
            name="ownerPerson"
            value={vehicle.ownerPerson}
            onChange={handleVehicleChange}
            className={inputClasses}
          >
            <option value="">Select</option>
            {ownerOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {errors.vehicleOwnerPerson && (
            <p className="text-xs font-medium text-red-500">{errors.vehicleOwnerPerson}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700">Ownership Type</label>
          <select
            name="ownershipType"
            value={vehicle.ownershipType}
            onChange={handleVehicleChange}
            className={inputClasses}
          >
            <option value="">Select</option>
            {VEHICLE_OWNERSHIP_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {errors.vehicleOwnershipType && (
            <p className="text-xs font-medium text-red-500">{errors.vehicleOwnershipType}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700">Main Vehicle Use</label>
          <select
            name="mainUse"
            value={vehicle.mainUse}
            onChange={handleVehicleChange}
            className={inputClasses}
          >
            <option value="">Select</option>
            {useOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {errors.vehicleMainUse && (
            <p className="text-xs font-medium text-red-500">{errors.vehicleMainUse}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700">Purchase Date</label>
          <input
            type="date"
            name="purchaseDate"
            value={vehicle.purchaseDate}
            onChange={handleVehicleChange}
            className={inputClasses}
          />
          {errors.vehiclePurchaseDate && (
            <p className="text-xs font-medium text-red-500">{errors.vehiclePurchaseDate}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700">Purchase Price</label>
          <input
            name="purchasePrice"
            value={vehicle.purchasePrice}
            onChange={handleVehicleChange}
            className={inputClasses}
            placeholder="e.g. 25000"
          />
          {errors.vehiclePurchasePrice && (
            <p className="text-xs font-medium text-red-500">{errors.vehiclePurchasePrice}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700">GST / HST Paid</label>
          <input
            name="gstHstPaid"
            value={vehicle.gstHstPaid}
            onChange={handleVehicleChange}
            className={inputClasses}
            placeholder="e.g. 1250"
          />
          {errors.vehicleGstHstPaid && (
            <p className="text-xs font-medium text-red-500">{errors.vehicleGstHstPaid}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">VIN</label>
          <input
            name="vin"
            value={vehicle.vin}
            onChange={handleVehicleChange}
            className={inputClasses}
            placeholder="Vehicle Identification Number"
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterVehiclePurchaseSection;
