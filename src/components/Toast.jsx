import { motion } from "framer-motion";

const Toast = ({ message, type, onClose }) => (
  <motion.div
    initial={{ x: 300 }}
    animate={{ x: 0 }}
    exit={{ x: 300 }}
    className={`fixed top-5 right-5 px-4 py-3 rounded shadow-lg z-50 text-white 
      ${type === "success" ? "bg-green-600" : "bg-red-600"}`}
  >
    <div className="flex items-center">
      <p className="mr-4">{message}</p>
      <button onClick={onClose} className="text-white text-lg">&times;</button>
    </div>
  </motion.div>
);

export default Toast;
