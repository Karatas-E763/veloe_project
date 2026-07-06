export type HomeTab = "pessoa-fisica" | "pessoa-juridica" | "parcerias";

export type DeviceType = "iphone" | "android";

export type DeliveryChoice = "yes" | "no";

export type VehicleType = "CARRO" | "MOTO" | "CAMINHAO";

export type PartnerBank =
  | "Bradesco"
  | "Itaú"
  | "Santander"
  | "C6 Bank"
  | "Sicredi"
  | "Banco do Brasil";

export interface Registration {
  id: string;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  cpf: string;
  birthDate: string;
  email: string;
  phone: string;
  deviceType: DeviceType;
  marketingOptIn: boolean;
  deliveryChoice: DeliveryChoice;
  stickerCount: number;
  bank: PartnerBank | "";
  licensePlate: string;
  vehicleType: VehicleType;
  homeTab: HomeTab;
}

export interface RegistrationFormData {
  fullName: string;
  cpf: string;
  birthDate: string;
  email: string;
  phone: string;
  deviceType: DeviceType | "";
  marketingOptIn: boolean;
  deliveryChoice: DeliveryChoice | "";
  stickerCount: number;
  bank: PartnerBank | "";
  licensePlate: string;
  confirmLicensePlate: string;
  vehicleType: VehicleType | "";
}

export const initialFormData: RegistrationFormData = {
  fullName: "",
  cpf: "",
  birthDate: "",
  email: "",
  phone: "",
  deviceType: "",
  marketingOptIn: false,
  deliveryChoice: "",
  stickerCount: 1,
  bank: "",
  licensePlate: "",
  confirmLicensePlate: "",
  vehicleType: "",
};
