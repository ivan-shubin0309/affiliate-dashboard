import { isNumeric } from "@/utils/format";
import { Text } from "@react-pdf/renderer";
import { keys } from "rambda";
import { styles } from "./styles";
interface HeaderProps {
  title: string;
  style?: object;
  is_table?: boolean;
}
export const Heading = ({ title, style, is_table }: HeaderProps) => {
  let _style: object = style ? style : styles.textHeading;

  if (is_table === true) {
    if (isNumeric(title)) {
      _style = { ..._style, paddingRight: "10px", textAlign: "right" };
    } else if (!isNumeric(title)) {
      _style = { ..._style, paddingLeft: "10px" };
    }
  }

  return <Text style={_style}>{title}</Text>;
};
