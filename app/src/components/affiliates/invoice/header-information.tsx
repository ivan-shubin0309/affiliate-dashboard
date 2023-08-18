import { Heading } from "./heading";
import { styles } from "./styles";
interface HeaderInformationProps {
  title: string;
  value: string;
  style?: object;
}
export const HeaderInformation = ({
  title,
  value,
  style,
}: HeaderInformationProps) => (
  <div style={style ? style : styles.flexDiv}>
    <Heading style={styles.textSmall} title={title} />
    <Heading style={styles.textBold} title={value} />
  </div>
);
