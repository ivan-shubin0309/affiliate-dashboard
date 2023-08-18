import { View } from "@react-pdf/renderer";
import { formatPrice } from "../../../utils/format";
import { Heading } from "./heading";
import { styles } from "./styles";
interface TableFooterProps {
  title: string;
  value: number;
  columnLength: number;
}
export const TableFooter = ({
  title,
  value,
  columnLength,
}: TableFooterProps) => {
  console.log(`${(100 / columnLength) * (columnLength - 1)}%`);

  return (
    <>
      <View
        style={{
          ...styles.tableCol75,
          width: `${(100 / columnLength) * (columnLength - 1)}%`,
        }}
      >
        <Heading style={styles.tableCell75} title={title} />
      </View>
      <View
        style={{
          ...styles.tableCol,
          width: `${100 / columnLength}%`,
        }}
      >
        <Heading
          style={{ ...styles.tableCell }}
          title={formatPrice(value)}
          is_table={true}
        />
      </View>
    </>
  );
};
