export interface HealCheckResponse {
  uptime: string;
  cpus: {
    model: string;
    speed: string;
    cores: string;
    used: string;
  };
  mem: {
    swap: string;
    used: string;
  };
  message: string;
  timestamp: string;
}
