//import { Heading } from './components/Heading';
//import { Timer } from 'lucide-react';
import { Container } from './Container';
import { Heading } from './Heading';

export function App() {
  return (
    <>
      {/* Seção 1: Logo */}
      <Container>
        <Heading>Logo</Heading>
      </Container>

      {/* Seção 2: Menu */}
      <Container>
        <Heading>Menu</Heading>
      </Container>
    </>
  );
}