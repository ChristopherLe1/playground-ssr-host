export const miniCartStyles = `
.c_MiniCart {
  position: relative;
  display: inline-block;
  margin-right: 1.5rem;
  padding: 1.5rem;
}

.c_MiniCart__quantity {
  background-color: #ff5a55;
  border-radius: 10px;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
  color: rgb(255, 255, 255);
  display: grid;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  font-weight: bold;
  height: 20px;
  letter-spacing: normal;
  min-width: 20px;
  place-content: center;
  position: absolute;
  right: 0;
  text-align: center;
  top: 0;
  transform: scale(1);
  transition: all 0.3s;
}
.c_MiniCart__quantity:empty { transform: scale(0); }

.c_MiniCart__button svg {
  --minicart-translate: -2px;
  transform: translateY(var(--minicart-translate));
}
`;
