import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Camera, Video, Eye, Sparkles, Focus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function RetinopathyAnalysisModal({ isOpen, onClose }) {
    const navigate = useNavigate();

    const handleImageAnalysis = () => {
        navigate('/analysis/retinopathy');
        onClose();
    };

    const handleVideoAnalysis = () => {
        navigate('/analysis/retinopathy-video');
        onClose();
    };

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { duration: 0.3, ease: "easeOut" }
        },
        exit: { 
            opacity: 0,
            transition: { duration: 0.2, ease: "easeIn" }
        }
    };

    const modalVariants = {
        hidden: { 
            opacity: 0, 
            scale: 0.8, 
            y: 50,
            rotateX: -15
        },
        visible: { 
            opacity: 1, 
            scale: 1, 
            y: 0,
            rotateX: 0,
            transition: { 
                duration: 0.4, 
                ease: "easeOut",
                type: "spring",
                damping: 25,
                stiffness: 300
            }
        },
        exit: { 
            opacity: 0, 
            scale: 0.9, 
            y: 30,
            transition: { duration: 0.2, ease: "easeIn" }
        }
    };

    const headerVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { delay: 0.2, duration: 0.3 }
        }
    };

    const cardContainerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delay: 0.3,
                staggerChildren: 0.15,
                delayChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, x: -30, scale: 0.95 },
        visible: { 
            opacity: 1, 
            x: 0, 
            scale: 1,
            transition: { 
                duration: 0.4,
                ease: "easeOut",
                type: "spring",
                damping: 20
            }
        },
        hover: { 
            scale: 1.03,
            y: -5,
            transition: { 
                duration: 0.2,
                ease: "easeOut"
            }
        },
        tap: { 
            scale: 0.98,
            transition: { duration: 0.1 }
        }
    };

    const iconVariants = {
        hidden: { scale: 0, rotate: -180 },
        visible: { 
            scale: 1, 
            rotate: 0,
            transition: { 
                delay: 0.2,
                duration: 0.3,
                ease: "easeOut"
            }
        },
        hover: { 
            scale: 1.1,
            rotate: 5,
            transition: { duration: 0.2 }
        }
    };

    const pulseVariants = {
        pulse: {
            scale: [1, 1.05, 1],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const floatingVariants = {
        float: {
            y: [-2, 2, -2],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div 
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={onClose}
                    >
                        {/* Modal Container */}
                        <motion.div 
                            className="bg-white rounded-3xl p-8 w-full max-w-md relative shadow-2xl border border-gray-100"
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.5)'
                            }}
                        >
                            {/* Close Button */}
                            <motion.button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                            >
                                <X size={24} />
                            </motion.button>

                            {/* Floating Medical Icons Background */}
                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                <motion.div
                                    className="absolute top-6 right-16 text-amber-100"
                                    variants={floatingVariants}
                                    animate="float"
                                >
                                    <Sparkles size={20} />
                                </motion.div>
                                <motion.div
                                    className="absolute bottom-8 left-6 text-orange-100"
                                    variants={floatingVariants}
                                    animate="float"
                                    style={{ animationDelay: '1s' }}
                                >
                                    <Focus size={16} />
                                </motion.div>
                            </div>

                            {/* Header */}
                            <motion.div 
                                className="text-center mb-8"
                                variants={headerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <motion.div
                                    className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mb-4 mx-auto"
                                    variants={pulseVariants}
                                    animate="pulse"
                                >
                                    <motion.div
                                        variants={iconVariants}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        <Eye className="w-8 h-8 text-white" />
                                    </motion.div>
                                </motion.div>

                                <motion.h2 
                                    className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.3 }}
                                >
                                    Retinopathy Detection
                                </motion.h2>

                                <motion.p 
                                    className="text-gray-500 text-sm"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5, duration: 0.3 }}
                                >
                                    Ophthalmology Retinal Analysis
                                </motion.p>
                            </motion.div>

                            {/* Analysis Options */}
                            <motion.div 
                                className="space-y-4"
                                variants={cardContainerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {/* Image Analysis Card */}
                                <motion.div 
                                    onClick={handleImageAnalysis}
                                    className="group cursor-pointer bg-gradient-to-r from-amber-50 via-amber-50 to-yellow-50 rounded-2xl p-6 border-2 border-amber-200/50 hover:border-amber-400/80 transition-all duration-300 relative overflow-hidden"
                                    variants={cardVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    {/* Card Background Animation */}
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-amber-100/30 to-yellow-100/30 opacity-0 group-hover:opacity-100"
                                        initial={{ scale: 0, opacity: 0 }}
                                        whileHover={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    />

                                    <div className="relative flex items-center space-x-4">
                                        <motion.div 
                                            className="p-3 bg-amber-500/10 rounded-xl border border-amber-200"
                                            variants={iconVariants}
                                            whileHover="hover"
                                        >
                                            <Camera className="w-6 h-6 text-amber-600" />
                                        </motion.div>

                                        <div className="flex-1">
                                            <motion.h3 
                                                className="text-lg font-bold text-amber-800 mb-1"
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.1 }}
                                            >
                                                Image Analysis
                                            </motion.h3>
                                            <motion.p 
                                                className="text-sm text-amber-600/80"
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                Upload and analyze retinal images
                                            </motion.p>
                                        </div>

                                        <motion.div
                                            className="text-amber-400 opacity-0 group-hover:opacity-100"
                                            initial={{ x: -10, opacity: 0 }}
                                            whileHover={{ x: 0, opacity: 1 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </motion.div>
                                    </div>
                                </motion.div>

                                {/* Video Analysis Card */}
                                <motion.div 
                                    onClick={handleVideoAnalysis}
                                    className="group cursor-pointer bg-gradient-to-r from-orange-50 via-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-200/50 hover:border-orange-400/80 transition-all duration-300 relative overflow-hidden"
                                    variants={cardVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    {/* Card Background Animation */}
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-orange-100/30 to-red-100/30 opacity-0 group-hover:opacity-100"
                                        initial={{ scale: 0, opacity: 0 }}
                                        whileHover={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    />

                                    <div className="relative flex items-center space-x-4">
                                        <motion.div 
                                            className="p-3 bg-orange-500/10 rounded-xl border border-orange-200"
                                            variants={iconVariants}
                                            whileHover="hover"
                                        >
                                            <Video className="w-6 h-6 text-orange-600" />
                                        </motion.div>

                                        <div className="flex-1">
                                            <motion.h3 
                                                className="text-lg font-bold text-orange-800 mb-1"
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.1 }}
                                            >
                                                Video Analysis
                                            </motion.h3>
                                            <motion.p 
                                                className="text-sm text-orange-600/80"
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                Upload and analyze retinal videos
                                            </motion.p>
                                        </div>

                                        <motion.div
                                            className="text-orange-400 opacity-0 group-hover:opacity-100"
                                            initial={{ x: -10, opacity: 0 }}
                                            whileHover={{ x: 0, opacity: 1 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* Footer */}
                            <motion.div 
                                className="mt-6 text-center"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8, duration: 0.3 }}
                            >
                                <p className="text-xs text-gray-400">
                                    Select an analysis type to proceed
                                </p>
                                <motion.div
                                    className="w-12 h-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full mx-auto mt-2"
                                    initial={{ width: 0 }}
                                    animate={{ width: 48 }}
                                    transition={{ delay: 1, duration: 0.5 }}
                                />
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default RetinopathyAnalysisModal; 
