import "./../_metronic/assets/sass/style.react.scss";
import "./../_metronic/assets/fonticon/fonticon.css";
import "./../_metronic/assets/keenicons/duotone/style.css";
import "./../_metronic/assets/keenicons/outline/style.css";
import "./../_metronic/assets/keenicons/solid/style.css";
import "./../_metronic/assets/sass/style.scss";
import "./../_metronic/assets/sass/custom/main.module.scss";
import "./../_metronic/assets/sass/custom/common.scss";
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>

      
          {children}
       


      </body>
    </html>
  );
}