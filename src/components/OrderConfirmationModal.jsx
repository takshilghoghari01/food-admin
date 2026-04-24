import React, { useState } from "react";

const OrderConfirmationModal = ({
  userName = "John Doe",
  userPhone = "+91 9876543210",
  initialTableNumber = "",
  totalAmount = 350,
  onClose = () => {},
  onPayment = (method, tableNumber) => {},
}) => {
  const [tableNumber, setTableNumber] = useState(initialTableNumber);
  const [tableNumberError, setTableNumberError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);

  const validateTableNumber = (value) => {
    if (value.trim() === "") {
      return "Table number is required.";
    }
    const numVal = Number(value);
    if (!Number.isInteger(numVal)) {
      return "Table number must be an integer.";
    }
    if (numVal < 1 || numVal > 30) {
      return "Table number must be between 1 and 30.";
    }
    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const error = validateTableNumber(tableNumber);
    if (error) {
      setTableNumberError(error);
      return;
    }
    setTableNumberError("");
    setShowConfirm(true);
  };

  const handlePaymentClick = (method) => {
    setShowConfirm(false);
    setShowRating(true);
    onPayment(method, tableNumber);
  };

  const handleRatingSelect = (rating) => {
    setSelectedRating(rating);
  };

  const handleSubmitRating = () => {
    if (selectedRating === 0) {
      alert("Please select a rating before submitting.");
      return;
    }
    alert(
      `Thank you for rating us ${selectedRating} star${
        selectedRating > 1 ? "s" : ""
      }!`
    );
    setShowRating(false);
    setTableNumber("");
    setSelectedRating(0);
    if (onClose) onClose();
  };

  const handleRemindLater = () => {
    setShowRating(false);
    if (onClose) onClose();
  };

  return (
    <>
      {!showRating && (
        <main
          className="container"
          style={{
            width: "100%",
            maxWidth: "420px",
            borderRadius: "16px",
            boxShadow: "0 6px 20px rgba(0,0,0,.08)",
            background: "#ffffff",
            padding: "32px 28px",
            boxSizing: "border-box",
            fontFamily: "'Inter', sans-serif",
            color: "#111827",
            margin: "auto",
          }}
        >
          <form
            id="orderForm"
            className="professional-form"
            noValidate
            onSubmit={handleSubmit}
          >
            <h2
              style={{
                color: "#ff6b00",
                fontWeight: 700,
                textAlign: "center",
                fontSize: "22px",
                marginBottom: "24px",
              }}
            >
              Place Your Order
            </h2>
            <div
              className="form-group"
              style={{
                marginBottom: "18px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <label
                style={{
                  fontWeight: 600,
                  marginBottom: "6px",
                  fontSize: "14px",
                  color: "#333",
                }}
              >
                Name
              </label>
              <div
                className="info-text"
                style={{
                  padding: "10px 14px",
                  fontSize: "16px",
                  borderRadius: "12px",
                  border: "1.5px solid #cbd5e1",
                  background: "#f7f7f7",
                  color: "#6b7280",
                  minHeight: "40px",
                  display: "flex",
                  alignItems: "center",
                  boxSizing: "border-box",
                  userSelect: "none",
                }}
              >
                {userName}
              </div>
            </div>
            <div
              className="form-group"
              style={{
                marginBottom: "18px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <label
                style={{
                  fontWeight: 600,
                  marginBottom: "6px",
                  fontSize: "14px",
                  color: "#333",
                }}
              >
                Phone Number
              </label>
              <div
                className="info-text"
                style={{
                  padding: "10px 14px",
                  fontSize: "16px",
                  borderRadius: "12px",
                  border: "1.5px solid #cbd5e1",
                  background: "#f7f7f7",
                  color: "#6b7280",
                  minHeight: "40px",
                  display: "flex",
                  alignItems: "center",
                  boxSizing: "border-box",
                  userSelect: "none",
                }}
              >
                {userPhone}
              </div>
            </div>
            <div
              className="form-group"
              style={{
                marginBottom: "18px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <label
                htmlFor="tableNumber"
                style={{
                  fontWeight: 600,
                  marginBottom: "6px",
                  fontSize: "14px",
                  color: "#333",
                }}
              >
                Table Number{" "}
                <span style={{ color: "#ef4444", marginLeft: "4px" }}>*</span>
              </label>
              <input
                type="number"
                id="tableNumber"
                min="1"
                max="30"
                placeholder="Enter your table number"
                required
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                style={{
                  padding: "10px 14px",
                  fontSize: "16px",
                  borderRadius: "12px",
                  border: "1.5px solid #cbd5e1",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#ff6b00")}
                onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
              />
              {tableNumberError && (
                <span
                  style={{
                    color: "#ef4444",
                    fontSize: "12px",
                    marginTop: "4px",
                    minHeight: "16px",
                    display: "block",
                  }}
                >
                  {tableNumberError}
                </span>
              )}
            </div>
            <div
              className="form-actions"
              style={{
                marginTop: "22px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <button
                type="submit"
                className="btn-submit"
                style={{
                  fontWeight: 700,
                  cursor: "pointer",
                  borderRadius: "16px",
                  border: "none",
                  transition: "background 0.3s ease",
                  fontSize: "16px",
                  padding: "14px 0",
                  width: "100%",
                  background: "linear-gradient(135deg, #ff6b00, #ff8a33)",
                  color: "white",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background =
                    "linear-gradient(135deg, #ff8a33, #ff6b00)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background =
                    "linear-gradient(135deg, #ff6b00, #ff8a33)")
                }
              >
                Submit Order
              </button>
            </div>
          </form>
        </main>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div
          className="confirm-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirmTitle"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10000,
          }}
          onClick={(e) => {
            if (e.target.classList.contains("confirm-modal")) {
              handlePaymentClick("online");
            }
          }}
        >
          <div
            className="confirm-content"
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "24px 28px",
              maxWidth: "360px",
              width: "90%",
              boxShadow: "0 6px 20px rgba(0,0,0,.08)",
              boxSizing: "border-box",
              textAlign: "center",
              fontFamily: "'Inter', sans-serif",
              whiteSpace: "pre-line",
            }}
          >
            <h3
              id="confirmTitle"
              style={{
                marginTop: 0,
                marginBottom: "12px",
                color: "#ff6b00",
                fontWeight: 700,
                fontSize: "20px",
              }}
            >
              Order Confirmation
            </h3>
            <p
              style={{
                margin: "8px 0",
                fontSize: "16px",
                color: "#111827",
                whiteSpace: "pre-wrap",
                lineHeight: 1.5,
                padding: "0 4px",
              }}
            >
              {`Name: ${userName}\nPhone: ${userPhone}\nTable Number: ${tableNumber}\nTotal Amount: ₹${totalAmount.toFixed(
                2
              )}`}
            </p>
            <div
              className="confirm-actions"
              style={{
                marginTop: "18px",
                display: "flex",
                justifyContent: "center",
                gap: "12px",
              }}
            >
              <button
                id="payOnlineBtn"
                aria-label="Pay online"
                onClick={() => handlePaymentClick("online")}
                style={{
                  background: "#ff6b00",
                  color: "white",
                  width: "48%",
                  cursor: "pointer",
                  marginTop: 0,
                  padding: "12px 0",
                  fontSize: "16px",
                  borderRadius: "16px",
                  border: "none",
                  fontWeight: 700,
                  transition: "background 0.3s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#ff8a33")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = "#ff6b00")
                }
              >
                Pay Online
              </button>
              <button
                id="payCashBtn"
                aria-label="Pay cash"
                onClick={() => handlePaymentClick("cash")}
                style={{
                  background: "#ff6b00",
                  color: "white",
                  width: "48%",
                  cursor: "pointer",
                  marginTop: 0,
                  padding: "12px 0",
                  fontSize: "16px",
                  borderRadius: "16px",
                  border: "none",
                  fontWeight: 700,
                  transition: "background 0.3s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#ff8a33")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = "#ff6b00")
                }
              >
                Pay Cash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rating Interface */}
      {showRating && (
        <main
          id="ratingInterface"
          className="container"
          style={{
            width: "100%",
            maxWidth: "420px",
            borderRadius: "16px",
            boxShadow: "0 6px 20px rgba(0,0,0,.08)",
            background: "#ffffff",
            padding: "32px 28px",
            boxSizing: "border-box",
            fontFamily: "'Inter', sans-serif",
            color: "#111827",
            margin: "auto",
            textAlign: "center",
            paddingBottom: "40px",
          }}
        >
          <h2
            style={{
              color: "#ff6b00",
              fontWeight: 700,
              fontSize: "22px",
              marginBottom: "24px",
            }}
          >
            Rate Your Experience
          </h2>
          <div
            className="rating-container"
            style={{
              position: "relative",
              textAlign: "center",
              paddingBottom: "40px",
            }}
          >
            <div
              className="stars"
              role="radiogroup"
              aria-label="Star rating"
              style={{
                display: "inline-block",
                fontSize: "32px",
                userSelect: "none",
                cursor: "pointer",
              }}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  role="radio"
                  aria-checked={selectedRating === star}
                  tabIndex={0}
                  aria-label={`${star} star${star > 1 ? "s" : ""}`}
                  onClick={() => handleRatingSelect(star)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleRatingSelect(star);
                    }
                    if (e.key === "ArrowRight" && star < 5) {
                      e.target.nextSibling?.focus();
                    }
                    if (e.key === "ArrowLeft" && star > 1) {
                      e.target.previousSibling?.focus();
                    }
                  }}
                  style={{
                    color: selectedRating >= star ? "#ffb400" : "#d1d5db",
                    transition: "color 0.3s ease, transform 0.2s ease",
                    display: "inline-block",
                    transform: selectedRating >= star ? "scale(1.25)" : "none",
                    marginRight: star < 5 ? "4px" : "0",
                  }}
                >
                  &#9733;
                </span>
              ))}
            </div>
            <div
              className="rating-text"
              id="ratingText"
              style={{
                marginTop: "12px",
                fontSize: "18px",
                fontWeight: 600,
                color: "#ff6b00",
              }}
            >
              {selectedRating
                ? `You selected ${selectedRating} star${
                    selectedRating > 1 ? "s" : ""
                  }`
                : "Select a rating"}
            </div>
            <button
              className="btn-submit"
              id="submitRatingBtn"
              style={{
                marginTop: "24px",
                fontWeight: 700,
                cursor: "pointer",
                borderRadius: "16px",
                border: "none",
                transition: "background 0.3s ease",
                fontSize: "16px",
                padding: "14px 0",
                width: "100%",
                background: "linear-gradient(135deg, #ff6b00, #ff8a33)",
                color: "white",
              }}
              onClick={handleSubmitRating}
              onMouseOver={(e) =>
                (e.currentTarget.style.background =
                  "linear-gradient(135deg, #ff8a33, #ff6b00)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.background =
                  "linear-gradient(135deg, #ff6b00, #ff8a33)")
              }
            >
              Submit Rating
            </button>
            <button
              id="remindLaterLink"
              className="remind-link"
              tabIndex={0}
              onClick={handleRemindLater}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleRemindLater();
                }
              }}
              style={{
                position: "absolute",
                bottom: "8px",
                right: "12px",
                fontSize: "14px",
                color: "#ff6b00",
                cursor: "pointer",
                textDecoration: "underline",
                background: "none",
                border: "none",
                padding: "4px 8px",
                fontWeight: 600,
                userSelect: "none",
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = "#ff8a33")}
              onMouseOut={(e) => (e.currentTarget.style.color = "#ff6b00")}
            >
              Remind me later
            </button>
          </div>
        </main>
      )}
    </>
  );
};

export default OrderConfirmationModal;
