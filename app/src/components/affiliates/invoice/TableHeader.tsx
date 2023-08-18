import { View } from "@react-pdf/renderer";
import { Heading } from "./heading";
import { styles } from "./styles";
interface TableHeaderProps {
  columnName: string;
  columns: number;
}
export const TableHeader = ({ columnName, columns }: TableHeaderProps) => {
  console.log(`${100 / columns}%`);

  return (
    <View
      style={{
        ...styles.tableHeadingCol,
        width: `${100 / columns}%`,
      }}
    >
      <Heading style={styles.tableCell} title={columnName} />
    </View>
  );
};
