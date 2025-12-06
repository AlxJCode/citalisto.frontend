import dayjs from "dayjs";
import "dayjs/locale/es";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import weekday from "dayjs/plugin/weekday";

// Extender dayjs con plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(weekday);

// Configurar zona horaria por defecto
dayjs.tz.setDefault("America/Lima");

// Configurar idioma por defecto (español ya tiene lunes como primer día)
dayjs.locale("es");

export default dayjs;
