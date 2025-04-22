import ErrorMessage from "../../../../common/ErrorMessage";

const UnitsSelect = ({ handleChange, value, errors }) => (
  <div className="flex flex-col w-1/2">
    <label className="block mb-2 text-sm font-medium text-gray-900">
      Units
    </label>
    <select
      name="units"
      className={`bg-gray-50 border ${
        errors?.units ? "border-red-500" : "border-gray-300"
      } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
      onChange={handleChange}
      value={value}
    >
      <option value="">Select Unit</option>
      <option value="peices">Peices</option>
      <option value="kg">Kg</option>
    </select>
    <ErrorMessage error={errors?.units} />
  </div>
);

export default UnitsSelect;
