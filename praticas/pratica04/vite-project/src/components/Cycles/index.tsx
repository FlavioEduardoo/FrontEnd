import { useTaskContext } from '../../contexts/TaskContext';
import { getNextCycle } from '../../utils/getNextCycle';
import { getNextCycleType } from '../../utils/getNextCycleType';
import styles from './styles.module.css';

export function Cycles() {
  const { state } = useTaskContext();
  const cycleStep = Array.from({ length: state.currentCycle });
  const cycleDescriptionMap = {
    workTime: 'foco',
    shortBreakTime: 'descanso curto',
    longBreakTime: 'descanso longo',
  };

  return (
    <div className={styles.cycles}>
      <span>Ciclos:</span>

      <div className={styles.cycleDots}>
          {cycleStep.map((_, index) => {
    // O índice começa em 0. Usamos nossas funções para saber o número e o tipo real do ciclo.
    const nextCycle = getNextCycle(index);
    const nextCycleType = getNextCycleType(nextCycle);

    return (
      <span
        // A prop 'key' é OBRIGATÓRIA no React para elementos gerados por map()
        key={nextCycle}
        // Aplicamos a classe base da bolinha + a classe dinâmica da cor (ex: styles.workTime)
        className={`${styles.cycleDot} ${styles[nextCycleType]}`}
        // Acessibilidade (Leitores de tela e tooltip ao passar o mouse)
        aria-label={`Indicador de ciclo de ${cycleDescriptionMap[nextCycleType]}`}
        title={`Indicador de ciclo de ${cycleDescriptionMap[nextCycleType]}`}
      ></span>
    );
  })}
      </div>
    </div>
  );
}
