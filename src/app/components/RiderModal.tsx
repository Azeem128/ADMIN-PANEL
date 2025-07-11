// "use client";

// interface Field {
//   name: string;
//   label: string;
//   type: string;
//   options?: string[];
//   required?: boolean;
//   readonly?: boolean;
// }

// interface Rider {
//   riderid: string;
//   name: string;
//   phone: string | null;
//   vehicletype: string | null;
//   createdat: string;
// }

// interface RiderModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   title: string;
//   onSubmit: (e: React.FormEvent) => Promise<void>;
//   fields: Field[];
//   rider?: Rider | null;
// }

// const RiderModal = ({ isOpen, onClose, title, onSubmit, fields, rider }: RiderModalProps) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white p-6 rounded-lg w-96">
//         <h2 className="text-xl font-bold mb-4 text-blue-900">{title}</h2>
//         <form onSubmit={onSubmit}>
//           {fields.map((field) => (
//             <div key={field.name} className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">{field.label}</label>
//               {field.type === "select" ? (
//                 <select
//                   name={field.name}
//                   defaultValue={rider ? rider[field.name as keyof Rider] as string : ""}
//                   className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required={field.required}
//                   disabled={field.readonly}
//                 >
//                   {field.options?.map((option) => (
//                     <option key={option} value={option}>
//                       {option}
//                     </option>
//                   ))}
//                 </select>
//               ) : (
//                 <input
//                   type={field.type}
//                   name={field.name}
//                   defaultValue={rider ? rider[field.name as keyof Rider] as string : ""}
//                   className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required={field.required}
//                   readOnly={field.readonly}
//                 />
//               )}
//             </div>
//           ))}
//           <div className="flex justify-end gap-2">
//             <button
//               type="button"
//               onClick={onClose}
//               className="p-2 bg-gray-300 rounded-lg hover:bg-gray-400"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//             >
//               {title.includes("Edit") || title.includes("Add") ? "Save" : "Close"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default RiderModal;


"use client";

interface Field {
  name: string;
  label: string;
  type: string;
  options?: string[];
  required?: boolean;
  readonly?: boolean;
}

interface Rider {
  riderid: string;
  name: string;
  phone: string | null;
  vehicletype: string | null;
  createdat: string;
}

interface RiderModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  fields: Field[];
  rider?: Rider | null;
}

const RiderModal = ({ isOpen, onClose, title, onSubmit, fields, rider }: RiderModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto"> {/* Added max-h and overflow-y-auto */}
        <h2 className="text-xl font-bold mb-4 text-blue-900">{title}</h2>
        <form onSubmit={onSubmit}>
          {fields.map((field) => (
            <div key={field.name} className="mb-4">
              <label className="block text-sm font-medium text-gray-700">{field.label}</label>
              {field.type === "select" ? (
                <select
                  name={field.name}
                  defaultValue={rider ? rider[field.name as keyof Rider] as string : ""}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={field.required}
                  disabled={field.readonly}
                >
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  defaultValue={rider ? rider[field.name as keyof Rider] as string : ""}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={field.required}
                  readOnly={field.readonly}
                />
              )}
            </div>
          ))}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {title.includes("Edit") || title.includes("Add") ? "Save" : "Close"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RiderModal;