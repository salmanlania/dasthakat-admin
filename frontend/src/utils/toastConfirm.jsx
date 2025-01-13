import { Button } from 'antd';
import toast from 'react-hot-toast';

/**
 * @param {string} message
 * @param {boolean} danger
 * @returns {Promise<boolean>}
 */
const toastConfirm = (message, danger = false) => {
  toast.dismiss();

  return new Promise((resolve) => {
    toast(
      (t) => (
        <div className="flex flex-col items-start">
          <p className="text-sm text-gray-900">{message}</p>
          <div className="mt-3 flex w-full justify-end gap-2">
            <Button
              className="w-full"
              onClick={() => {
                toast.dismiss(t.id);
                resolve(false);
              }}>
              No
            </Button>

            <Button
              type="primary"
              className="w-full"
              danger={danger}
              onClick={() => {
                toast.dismiss(t.id);
                resolve(true);
              }}>
              Yes
            </Button>
          </div>
        </div>
      ),
      {
        duration: Infinity
      }
    );
  });
};

export default toastConfirm;
