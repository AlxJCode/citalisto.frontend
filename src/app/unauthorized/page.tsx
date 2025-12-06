import { Typography, Button, Result } from "antd";
import Link from "next/link";

export default function UnauthorizedPage() {
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
            <Result
                status="403"
                title="403"
                subTitle="Lo sentimos, no tienes permiso para acceder a esta página."
                extra={
                    <Link href="/">
                        <Button type="primary" size="large">
                            Volver al inicio
                        </Button>
                    </Link>
                }
            />
        </div>
    );
}
