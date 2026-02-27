import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export const Button = ({ children, className, isLoading, ...props }) => (
    <motion.button
        whileTap={{ scale: 0.98 }}
        className={cn(
            "bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg",
            className
        )}
        disabled={isLoading}
        {...props}
    >
        {isLoading ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" /> : children}
    </motion.button>
);

export const Input = ({ label, className, ...props }) => (
    <div className="flex flex-col gap-1 w-full">
        {label && <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
        <input
            className={cn(
                "w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all duration-200",
                className
            )}
            {...props}
        />
    </div>
);

export const Card = ({ children, className }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6", className)}
    >
        {children}
    </motion.div>
);
