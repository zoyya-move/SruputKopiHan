document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    items: [
      { id: 2, name: "Coffe Corfa", img: "2.jpg", price: 55200 },
      { id: 3, name: "Coffe Pachest", img: "3.jpg", price: 63750 },
      { id: 4, name: "Coffe Top Land", img: "4.jpg", price: 68000 },
      { id: 5, name: "Coffe Blended", img: "5.jpg", price: 51000 },
      { id: 6, name: "Coffe Torava", img: "6.jpg", price: 72250 },
      { id: 7, name: "Coffe Robusta", img: "7.jpg", price: 42500 },
      { id: 8, name: "Coffe Ofeage", img: "8.jpg", price: 59500 },
      { id: 9, name: "Coffe Cocohine", img: "9.jpg", price: 63750 },
      { id: 10, name: "Coffe Blartinighi", img: "10.jpg", price: 76500 },
    ],
  }));

  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
    add(newItems) {
      const cartItem = this.items.find((item) => item.id === newItems.id);

      if (!cartItem) {
        this.items.push({ ...newItems, quantity: 1, total: newItems.price });
        this.quantity++;
        this.total += newItems.price;
      } else {
        this.items = this.items.map((item) => {
          if (item.id !== newItems.id) {
            return item;
          } else {
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += newItems.price;
            return item;
          }
        });
      }
    },
    remove(id) {
      const cartItem = this.items.find((item) => item.id === id);

      if (cartItem.quantity > 1) {
        this.items = this.items.map((item) => {
          if (item.id !== id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      } else if (cartItem.quantity === 1) {
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });
});

// Konversi ke Rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
