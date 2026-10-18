import { Container } from "./common/Container";
import { Link } from "./common/Link";
import { StyledBigHeader, StyledSubHeader } from "./common/StyledHeading";

const legalPage =
  "[&_h1]:mt-24 [&_h1]:mb-8 [&_h1]:text-[2.6rem] [&_h1]:font-medium [&_h1:first-child]:mt-0 [&_h2]:mt-20 [&_h2]:mb-6 [&_h2]:text-[2rem] [&_h2]:font-medium [&_p]:mb-10 [&_ul]:mb-10 [&_ul]:pl-24 [&_ul]:list-disc";

export const TermsOfService = () => {
  return (
    <Container textLeft className={legalPage}>
      <StyledBigHeader>Terms of Service/Vilkår for bruk</StyledBigHeader>
      <p>Vennligst les disse vilkårene før du bruker https://gaveønske.no</p>
      <StyledSubHeader>Vilkår for bruk</StyledSubHeader>
      <p>
        Du kan bruke denne tjenesten som du selv ønsker, men ikke gjør noe
        ugagn. Vet uvettig bruk kan vi stenge ned kontoer og/eller hele
        tjenesten.
      </p>
      <StyledSubHeader>Privacy Policy</StyledSubHeader>
      <p>
        Vi anbefaler å lese <Link to="/privacypolicy">Privacy Policy</Link> for
        detaljer om personvern og hva vi gjør med dine privata data. PS: Svaret
        er ingenting bortsett fra å få siden til å funke.
      </p>
      <StyledSubHeader>User Account</StyledSubHeader>
      <p>
        Som eier av kontoer på denne siden er du selv ansvarlig for at dine data
        ikke kommer på avveien. Så ikke del passordet med noen. Du er ansvarlig
        for hva som skjer når du er innlogget på din konto.
      </p>
    </Container>
  );
};
