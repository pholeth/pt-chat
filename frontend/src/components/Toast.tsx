import { useEffect } from 'react';

type ToastProps = {
    message: string;
    onClose: () => void;
    time?: number;
};

const Toast = ({ message, onClose, time = 3000 }: ToastProps) => {
    useEffect(() => {
        const timer = setTimeout(onClose, time);
        return () => clearTimeout(timer);
    }, [onClose, time]);

    return (
        <div className="toast toast-top toast-start">
            <div className="alert alert-info">
                <span>{message}</span>
            </div>
        </div>
    );
};

export default Toast;
