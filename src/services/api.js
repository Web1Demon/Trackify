const API_URL = "http://localhost:4000/orders";

export const saveOrder = async (order) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });
  return res.json();
};

export const fetchOrder = async (id) => {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) return null;
  return res.json();
};

export const fetchOrders = async () => {
  const res = await fetch(API_URL);
  return res.json();
};

export const updateOrderStatus = async (id, payload) => {
  await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};

