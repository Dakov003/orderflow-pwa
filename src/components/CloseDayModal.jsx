import React, { useState, useMemo } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './UI';
import { PrimaryButton } from './UI';
import { formatCurrency } from '../utils/helpers';
import { writeBatch, doc, collection, serverTimestamp } from 'firebase/firestore';
import { APP_ID } from '../firebase.js';

const CloseDayModal = ({ isOpen, onClose, orders, payments, db, showToast }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [confirmTransfer, setConfirmTransfer] = useState(false);

    const { dailyStats, openOrdersForTransfer } = useMemo(() => {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        
        const todaysOrders = orders.filter(o => o.createdAt?.toDate() >= todayStart);
        const openOrders = todaysOrders.filter(o => o.status === 'Deschisă' || o.status === 'Plătită Parțial');
        
        const todaysPayments = payments.filter(p => p.createdAt?.toDate() >= todayStart);

        let debtCollections = 0;
        let dailyCollections = 0;

        todaysPayments.forEach(payment => {
            if (payment.settlementDetails && payment.settlementDetails.length > 0) {
                payment.settlementDetails.forEach(detail => {
                    const settledOrder = orders.find(o => o.id === detail.orderId);
                    if (settledOrder) {
                        if (settledOrder.createdAt?.toDate() < todayStart) {
                            debtCollections += detail.amountSettled;
                        } else {
                            dailyCollections += detail.amountSettled;
                        }
                    } else {
                        dailyCollections += detail.amountSettled;
                    }
                });
            } else {
                dailyCollections += payment.amount;
            }
        });

        const totalCollections = debtCollections + dailyCollections;
        const expectedIncomeToday = todaysOrders
            .filter(o => o.status !== 'Stornată' && o.status !== 'Transferată')
            .reduce((sum, o) => sum + o.totalAmount, 0);

        const stats = {
            totalCollections,
            debtCollections,
            dailyCollections,
            expectedIncomeToday,
            orderCount: todaysOrders.length,
        };

        return { dailyStats: stats, openOrdersForTransfer: openOrders };
    }, [orders, payments]);

    const handleConfirmCloseDay = async () => {
        if (openOrdersForTransfer.length > 0 && !confirmTransfer) {
            showToast("Trebuie să confirmați transferul datoriilor.", "error");
            return;
        }
        setIsClosing(true);
        try {
            const batch = writeBatch(db);

            const closingData = {
                closingDate: serverTimestamp(),
                totalCollections: dailyStats.totalCollections,
                debtCollections: dailyStats.debtCollections,
                dailyCollections: dailyStats.dailyCollections,
                expectedIncomeToday: dailyStats.expectedIncomeToday,
                orderCount: dailyStats.orderCount,
                transferredOrdersCount: openOrdersForTransfer.length
            };
            const closingRef = doc(collection(db, `/artifacts/${APP_ID}/public/data/dayClosings`));
            batch.set(closingRef, closingData);

            openOrdersForTransfer.forEach(order => {
                const orderRef = doc(db, `/artifacts/${APP_ID}/public/data/orders`, order.id);
                batch.update(orderRef, { status: 'Transferată' });
            });

            await batch.commit();
            showToast("Ziua a fost închisă cu succes!", "success");
            onClose();
        } catch (error) {
            console.error("Eroare la închiderea zilei:", error);
            showToast("A apărut o eroare la salvarea raportului.", "error");
        } finally {
            setIsClosing(false);
            setConfirmTransfer(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Închidere Zi - ${new Date().toLocaleDateString('ro-RO')}`}>
            <div>
                <div className="p-4 bg-gray-100 rounded-lg space-y-2 mb-6">
                        <div>
                            <div className="flex justify-between text-lg font-bold">
                                <span>Valoare Comenzi Noi</span>
                                <span className="font-mono">{formatCurrency(dailyStats.expectedIncomeToday)}</span>
                            </div>
                            <p className="text-xs text-gray-500">(fără stornări/transferuri)</p>
                        </div>
                        <hr className="my-2"/>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Încasări Datorii Anterioare</span>
                            <span className="font-mono">{formatCurrency(dailyStats.debtCollections)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Încasări Comenzi Curente</span>
                            <span className="font-mono">{formatCurrency(dailyStats.dailyCollections)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2 text-green-600">
                            <span>Total Încasat Astăzi</span>
                            <span className="font-mono">{formatCurrency(dailyStats.totalCollections)}</span>
                        </div>
                </div>

                {openOrdersForTransfer.length > 0 && (
                    <div className="mt-6 p-4 bg-red-100 text-red-800 rounded-lg">
                        <h4 className="font-bold mb-2">Există {openOrdersForTransfer.length} comandă/comenzi deschise:</h4>
                        <ul className="list-disc pl-5 text-sm">
                            {openOrdersForTransfer.map(o => <li key={o.id}>{o.customerName} - Datorie: {formatCurrency(o.totalAmount - (o.paidAmount || 0))}</li>)}
                        </ul>
                        <div className="mt-4">
                            <label className="flex items-center">
                                <input type="checkbox" checked={confirmTransfer} onChange={() => setConfirmTransfer(!confirmTransfer)} className="h-4 w-4 rounded"/>
                                <span className="ml-2 font-semibold">Confirm transferul acestor datorii pe ziua următoare.</span>
                            </label>
                        </div>
                    </div>
                )}
                <div className="mt-6 flex justify-end">
                    <PrimaryButton onClick={handleConfirmCloseDay} disabled={isClosing || (openOrdersForTransfer.length > 0 && !confirmTransfer)}>
                        {isClosing ? 'Se salvează...' : 'Confirmă Închiderea'}
                    </PrimaryButton>
                </div>
            </div>
        </Modal>
    );
};

export default CloseDayModal;
