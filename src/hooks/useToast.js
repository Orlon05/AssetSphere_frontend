import Swal from 'sweetalert2';

const useToast = () => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  const showSuccessToast = (message) => {
    Toast.fire({
      icon: "success",
      title: message || "Acción realizada exitosamente",
    });
  };

  return { showSuccessToast };
};

export default useToast;