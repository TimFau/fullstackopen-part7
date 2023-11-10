const Notification = ({ successMessage, errorMessages }) => {
  return (
    <>
      {successMessage && <p className="success">{successMessage}</p>}
      {errorMessages.map((errorMessage, index) => (
        <p className="error" key={index}>
          {errorMessage}
        </p>
      ))}
    </>
  );
};

export default Notification;
