import { View } from "@react-pdf/renderer";
import { Heading } from "./heading";
import { styles } from "./styles";
interface TableRowProps {
  data: string;
  columns: number;
}
export const TableRow = ({ data, columns }: TableRowProps) => (
  <View
    style={{
      ...styles.tableCol,
      width: `${100 / columns}%`,
    }}
  >
    <Heading style={styles.tableCell} title={data} is_table={true} />
  </View>
);
