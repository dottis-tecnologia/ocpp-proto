export type Connection = {
  chargePointModel: string;
  chargePointVendor: string;
};
const connections: Record<string, Connection> = {};

export default connections;
