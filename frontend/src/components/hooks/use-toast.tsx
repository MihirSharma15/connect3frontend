import { toast as hotToast } from "react-hot-toast";

export const toast = (notification: { title: string; description?: string }) => {
  hotToast(
    (t) => (
      <div
        className="bg-white border border-gray-300 shadow-md rounded-md p-4"
        style={{ maxWidth: "300px" }}
      >
        <h3 className="font-bold text-lg">{notification.title}</h3>
        {notification.description && (
          <p className="text-gray-700 text-sm mt-2">{notification.description}</p>
        )}
        <button
          onClick={() => hotToast.dismiss(t.id)}
          className="text-blue-500 text-sm mt-2"
        >
          Dismiss
        </button>
      </div>
    ),
    { duration: 4000 } // Toast will last for 4 seconds
  );
};
