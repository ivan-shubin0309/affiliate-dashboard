import { CalendarDatePicker } from "./date-input";

const meta = {
  component: CalendarDatePicker,
};

export default meta;

export const DefaultTyping = {
  render: () => <CalendarDatePicker />,
};
export const WithTyping = {
  render: () => <CalendarDatePicker allowTyping={true} />,
};

export const WithoutTyping = {
  render: () => <CalendarDatePicker allowTyping={false} />,
};

export const DefaultIcon = {
  render: () => <CalendarDatePicker />,
};

export const WithIcon = {
  render: () => <CalendarDatePicker showIcon={true} />,
};

export const WithoutIcon = {
  render: () => <CalendarDatePicker showIcon={false} />,
};

// export const Error = {
//   render: () => <CalendarDatePicker error="Error" />,
// };
