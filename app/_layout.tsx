import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MilestoneProvider } from '../context/MilestoneContext';
import { RemedyProvider } from '../context/RemedyContext';
import { VaccinationProvider } from '../context/VaccinationContext';

export default function Layout() {
  return (
    <SafeAreaProvider>
      <RemedyProvider>
        <VaccinationProvider>
          <MilestoneProvider>
            <Slot />
          </MilestoneProvider>
        </VaccinationProvider>
      </RemedyProvider>
    </SafeAreaProvider>
  );
}
