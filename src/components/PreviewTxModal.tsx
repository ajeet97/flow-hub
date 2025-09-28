import { useEffect, useState } from 'react';
import { X, XCircle, Code } from 'lucide-react';
import { TransactionButton } from "@onflow/react-sdk"

// Cadence Code Modal Component
export const PreviewTxModal = ({
    isOpen,
    onClose,
    txCode,
}) => {
    let [txId, setTxId] = useState('')

    const handleClose = () => {
        setTxId('');
        onClose();
    }

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Handle ESC key press
    useEffect(() => {
        const handleEscKey = (e) => {
            if (e.key === 'Escape' && isOpen) {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscKey);
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [isOpen, handleClose]);

    if (!isOpen) return null;

    // const formatCadenceCode = (code) => {
    //     // Basic syntax highlighting simulation with spans
    //     return code
    //         .replace(/\b(transaction|prepare|execute|import|from|pub|fun|resource|struct|contract|let|var|if|else|while|for|return)\b/g,
    //             '<span class="text-purple-600 font-semibold">$1</span>')
    //         .replace(/\b(UFix64|Fix64|UInt64|Int64|UInt32|Int32|UInt16|Int16|UInt8|Int8|Bool|String|Address|AuthAccount|PublicAccount)\b/g,
    //             '<span class="text-blue-600 font-semibold">$1</span>')
    //         .replace(/"([^"]*)"/g, '<span class="text-green-600">"$1"</span>')
    //         .replace(/\/\/.*$/gm, '<span class="text-gray-500 italic">$&</span>')
    //         .replace(/\/\*[\s\S]*?\*\//g, '<span class="text-gray-500 italic">$&</span>');
    // };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300"
                onClick={handleClose}
            />

            {/* Modal Container */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div
                    className="relative w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 ease-out animate-in fade-in-0 zoom-in-95"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4">
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-lg">
                                <Code className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">
                                    Review Transaction
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Please review the Cadence code before execution
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="rounded-lg p-2 text-gray-400 hover:bg-white hover:text-gray-600 transition-colors duration-200"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Tx ID */}
                        {
                            txId != '' && (
                                <div>
                                    Tx: <a className="text-blue-600" href={`https://www.flowscan.io/tx/${txId}`} target='_blank'>{txId}</a>
                                </div>
                            )
                        }

                        {/* Warning Banner */}
                        {/* <div className="flex items-start space-x-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                            <div className="text-sm">
                                <p className="text-amber-800 font-medium mb-1">
                                    Review Before Execution
                                </p>
                                <p className="text-amber-700">
                                    This transaction will be executed on the Flow blockchain and cannot be undone.
                                    Please review the code and parameters carefully.
                                </p>
                            </div>
                        </div> */}

                        {/* Code Preview */}
                        <div>
                            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                                <pre className="text-sm text-gray-100 whitespace-pre-wrap">
                                    {/* <code
                                        dangerouslySetInnerHTML={{
                                            __html: formatCadenceCode(txCode)
                                        }}
                                    /> */}
                                    <code>{txCode}</code>
                                </pre>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end space-x-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
                        <button
                            onClick={handleClose}
                            className={`
                                inline-flex items-center space-x-2 px-6 py-2 text-gray-700 font-medium transition-colors duration-200 hover:text-gray-900 hover:bg-gray-200 rounded-lg
                            `}
                        >
                            <XCircle size={16} />
                            <span>Cancel</span>
                        </button>

                        <TransactionButton
                            transaction={{ cadence: txCode }}
                            label='Execute'
                            variant='secondary'
                            className='execute-button'
                            disabled={!txCode}
                            mutation={{
                                onSuccess: (txId) => {
                                    setTxId(txId)
                                    console.log("Transaction sent:", txId)
                                },
                                onError: (error) => console.error("Transaction failed:", error),
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};