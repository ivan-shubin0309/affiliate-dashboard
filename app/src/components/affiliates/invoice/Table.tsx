import { View } from "@react-pdf/renderer";
import { TableFooter } from "./TableFooter";
import { TableHeader } from "./TableHeader";
import { TableRow } from "./TableRow";
import { styles } from "./styles";

interface footer {
  title: string;
  value: number;
}
interface tableData {
  merchant: string;
  deal: string;
  unitPrice: string;
  quantity: string;
  price: string;
}
interface paymentTableData {
  merchant: string;
  deal: string;
  quantity: string;
  total_price: string;
}

interface TableProps {
  columns: string[];
  data?: tableData[] | paymentTableData[];
  footers: footer[];
}
export const Table = ({ columns, data, footers }: TableProps) => (
  <>
    <View style={styles.table}>
      <View style={styles.tableRow}>
        {columns.map((i: string, index: number) => (
          <TableHeader columnName={i} key={index} columns={columns.length} />
        ))}
      </View>
      {data &&
        data.map((i: tableData | paymentTableData, index: number) => (
          <View
            style={styles.tableRow}
            key={`${typeof i}-${i["deal"]}-${index}`}
          >
            {Object.keys(i).map((item) => (
              <TableRow
                key={`${typeof i}-${i["deal"]}-${index}-${item}`}
                data={i[item as keyof (tableData | paymentTableData)]}
                columns={columns.length}
              />
            ))}
          </View>
        ))}
      {footers.map((i: footer, index: number) => (
        <View style={styles.tableRow} key={index}>
          <TableFooter
            title={i.title}
            value={i.value}
            columnLength={columns.length}
          />
        </View>
      ))}
    </View>
  </>
);
