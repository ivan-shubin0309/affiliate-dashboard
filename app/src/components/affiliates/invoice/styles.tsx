import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  CommissionSection: {
    fontSize: 12,
    paddingBottom: 4,
    flexGrow: 1,
  },
  ExtraSection: {
    fontSize: 12,
    paddingBottom: 4,
    paddingTop: 12,
    flexGrow: 1,
  },
  textSmall: {
    fontSize: 10,
    color: "#948f8f",
  },
  textMedium: {
    fontSize: 12,
    color: "#666666",
  },
  textLarge: {
    fontSize: 16,
    color: "#948f8f",
  },
  textBold: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#000",
  },
  // for table 2
  table: {
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCol: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableHeadingCol: {
    // width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#C9C9C9",
    textAlign: "center",
  },
  tableCol75: {
    width: "80%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    // margin: "auto",
    marginTop: 3,
    marginBottom: 2,
    fontSize: 10,
  },
  tableCell75: {
    width: "auto",
    marginLeft: "auto",
    paddingRight: 3,
    marginTop: 3,
    fontSize: 10,
  },
  img: {
    width: 200,
  },
  borderSection: {
    marginLeft: 10,
    marginRight: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  borderLine: {
    width: "100%",
    height: 1,
    backgroundColor: "#c9c9c9",
  },
  paymentForm: {
    fontSize: 17,
    color: "#666666",
    fontWeight: 800,
  },
  textHeading: {
    paddingLeft: "20px",
    fontSize: 12,
    marginBottom: "5px",
    fontWeight: "bold",
    color: "#000",
  },
  flexDiv: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: "20px",
    paddingLeft: "20px",
    marginTop: "1px",
  },
  headerFlexDiv: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "1px",
    paddingRight: "20px",
  },
});
