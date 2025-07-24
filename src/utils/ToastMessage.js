import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export class ToastMessage {
    static notifySuccess = (message) => toast.success(message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
            textTransform: "capitalize",
            fontFamily: "Figtree, sans-serif",
        }

    });
    static notifyError = (message) => toast.error(message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
            textTransform: "capitalize",
            fontFamily: "Figtree, sans-serif",
        }

    });


    static notifyInfo = (message) => toast.info(message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
            textTransform: "capitalize",
            fontFamily: "Figtree, sans-serif",
        }
    });
}