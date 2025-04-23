import ErrorMessage from "../../../../common/ErrorMessage";

const StoreSelect = ({ handleChange, value, errors }) => (
  <div className="flex flex-col w-1/2">
    <label className="block mb-2 text-sm font-medium text-gray-900">
      Store
    </label>
    <select
      name="units"
      className={`bg-gray-50 border ${
        errors?.units ? "border-red-500" : "border-gray-300"
      } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
      onChange={handleChange}
      value={value}
    >
      <option value="">Select Store</option>
      <option value="peices">Calicut</option>
      <option value="kg">Kannur</option>
    </select>
    <ErrorMessage error={errors?.units} />
  </div>
);

export default StoreSelect;
