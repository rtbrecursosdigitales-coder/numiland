import { GameTask, TaskType } from '../types';
import { FRUITS, ANIMALS, OBJECTS } from '../constants';

export class GameGenerator {
  static generateTask(type: TaskType, min: number, max: number, index: number = 0, total: number = 5, targetTable?: number): GameTask {
    const id = Math.random().toString(36).substr(2, 9);
    
    // Progressive range calculation
    const progress = (index + 1) / total;
    const currentMax = Math.round(min + (max - min) * progress);
    const currentMin = Math.round(min + (max - min) * (progress * 0.5));
    
    // Ensure we have a reasonable spread
    const effectiveMin = Math.max(min, currentMin - Math.round((max - min) * 0.2));
    const effectiveMax = Math.min(max, currentMax + 2); // buffer
    
    switch (type) {
      case TaskType.COUNTING:
        return this.genCounting(id, effectiveMin, effectiveMax);
      case TaskType.MATCHING:
        return this.genMatching(id, effectiveMin, effectiveMax);
      case TaskType.SEQUENCE:
        return this.genSequence(id, effectiveMin, effectiveMax);
      case TaskType.MISSING_NUMBER:
        return this.genMissingNumber(id, effectiveMin, effectiveMax, targetTable);
      case TaskType.NUMBER_LINE:
        return this.genNumberLine(id, effectiveMin, effectiveMax);
      case TaskType.ORDERING:
        return this.genOrdering(id, effectiveMin, effectiveMax);
      case TaskType.COMPARISON:
        return this.genComparison(id, effectiveMin, effectiveMax);
      case TaskType.PATTERN:
        return this.genPattern(id, effectiveMin, effectiveMax);
      case TaskType.ADDITION:
        return this.genAddition(id, effectiveMin, effectiveMax);
      case TaskType.SUBTRACTION:
        return this.genSubtraction(id, effectiveMin, effectiveMax);
      case TaskType.MULTIPLICATION:
        return this.genMultiplication(id, effectiveMin, effectiveMax, targetTable);
      case TaskType.DIVISION:
        return this.genDivision(id, effectiveMin, effectiveMax, targetTable);
      case TaskType.ALGEBRA:
        return this.genAlgebra(id, effectiveMin, effectiveMax);
      case TaskType.GEOMETRY:
        return this.genGeometry(id, effectiveMin, effectiveMax);
      case TaskType.COORDINATES:
        return this.genCoordinates(id, effectiveMin, effectiveMax);
      case TaskType.FUNCTIONS:
        return this.genFunctions(id, effectiveMin, effectiveMax);
      case TaskType.VISUAL_MULTIPLICATION:
        return this.genVisualMultiplication(id, effectiveMin, effectiveMax, targetTable);
      case TaskType.WORD_PROBLEM:
        return this.genWordProblem(id, effectiveMin, effectiveMax, targetTable);
      case TaskType.MISSING_FACTOR:
        return this.genMissingFactor(id, effectiveMin, effectiveMax, targetTable);
      default:
        return this.genCounting(id, effectiveMin, effectiveMax);
    }
  }

  private static genMissingFactor(id: string, min: number, max: number, targetTable?: number): GameTask {
    const factor1 = targetTable !== undefined ? targetTable : Math.floor(Math.random() * 10) + 1;
    const factor2 = Math.floor(Math.random() * 10) + 1;
    const answer = factor2;
    const result = factor1 * factor2;
    
    const options = this.generateOptions(answer, 0, 12, 4);

    return {
      id,
      type: TaskType.MISSING_FACTOR,
      prompt: `Encuentra el factor que falta`,
      question: { n1: factor1, n2: factor2, result, symbol: '×' },
      answer,
      options
    };
  }

  private static genVisualMultiplication(id: string, min: number, max: number, targetTable?: number): GameTask {
    const groups = targetTable !== undefined ? targetTable : Math.floor(Math.random() * 9) + 2;
    const itemsPerGroup = targetTable !== undefined ? Math.floor(Math.random() * 10) + 1 : Math.floor(Math.random() * 5) + 2;
    // Swap sometimes for variety if targetTable is used
    const finalGroups = (targetTable !== undefined && Math.random() > 0.5) ? itemsPerGroup : groups;
    const finalItems = (targetTable !== undefined && finalGroups === itemsPerGroup) ? groups : itemsPerGroup;

    const answer = finalGroups * finalItems;
    const item = OBJECTS[Math.floor(Math.random() * OBJECTS.length)];
    
    const options = this.generateOptions(answer, 0, Math.max(answer + 10, 50), 4);

    return {
      id,
      type: TaskType.VISUAL_MULTIPLICATION,
      prompt: `¿Cuántos objetos hay en total?`,
      question: { groups: finalGroups, itemsPerGroup: finalItems, icon: item },
      answer,
      options
    };
  }

  private static genWordProblem(id: string, min: number, max: number, targetTable?: number): GameTask {
    const isMultiplication = Math.random() > 0.5;
    let prompt = '';
    let answer = 0;
    
    const factor1 = targetTable !== undefined ? targetTable : Math.floor(Math.random() * 10) + 1;
    const factor2 = Math.floor(Math.random() * 10) + 1;

    if (isMultiplication) {
        answer = factor1 * factor2;
        prompt = `Si tienes ${factor1} cajas con ${factor2} alfajores cada una, ¿cuántos alfajores tienes en total?`;
    } else {
        const dividend = factor1 * factor2;
        answer = factor2;
        prompt = `Tienes ${dividend} caramelos y quieres repartirlos en partes iguales entre ${factor1} amigos. ¿Cuántos recibe cada uno?`;
    }

    const options = this.generateOptions(answer, 0, 100, 4);

    return {
      id,
      type: TaskType.WORD_PROBLEM,
      prompt,
      question: null,
      answer,
      options
    };
  }

  private static genMultiplication(id: string, min: number, max: number, targetTable?: number): GameTask {
    const n1 = targetTable !== undefined ? targetTable : Math.floor(Math.random() * 12) + 1;
    const n2 = Math.floor(Math.random() * 12) + 1;
    // Randomly swap n1 and n2 if targetTable is specified to practice commutativity
    const finalN1 = (targetTable !== undefined && Math.random() > 0.5) ? n2 : n1;
    const finalN2 = (targetTable !== undefined && finalN1 === n2) ? n1 : n2;

    const answer = finalN1 * finalN2;
    const options = this.generateOptions(answer, 0, Math.max(answer + 10, max), 4);

    return {
      id,
      type: TaskType.MULTIPLICATION,
      prompt: `¿Cuánto es ${finalN1} x ${finalN2}?`,
      question: { n1: finalN1, n2: finalN2, symbol: '×' },
      answer,
      options
    };
  }

  private static genDivision(id: string, min: number, max: number, targetTable?: number): GameTask {
    const divisor = targetTable !== undefined ? (targetTable === 0 ? 1 : targetTable) : Math.floor(Math.random() * 9) + 2;
    const quotient = Math.floor(Math.random() * 10) + 1;
    const dividend = divisor * quotient;
    const answer = quotient;
    const options = this.generateOptions(answer, 0, dividend + 5, 4);

    return {
      id,
      type: TaskType.DIVISION,
      prompt: `¿Cuánto es ${dividend} ÷ ${divisor}?`,
      question: { n1: dividend, n2: divisor, symbol: '÷' },
      answer,
      options
    };
  }

  private static genAlgebra(id: string, min: number, max: number): GameTask {
    const isAddition = Math.random() > 0.5;
    // Scale n1 and answer based on max to increase difficulty
    const scale = max > 1000 ? 100 : 10;
    const n1 = Math.floor(Math.random() * (max/scale)) + 1;
    const answer = Math.floor(Math.random() * (max/scale)) + 1;
    const result = isAddition ? n1 + answer : n1 * answer;
    
    const xIsFirst = Math.random() > 0.5;
    const equation = isAddition 
      ? (xIsFirst ? `x + ${n1} = ${result}` : `${n1} + x = ${result}`)
      : (xIsFirst ? `x · ${n1} = ${result}` : `${n1} · x = ${result}`);

    const options = this.generateOptions(answer, 0, max, 4);

    return {
      id,
      type: TaskType.ALGEBRA,
      prompt: 'Encuentra el valor de x',
      question: equation,
      answer,
      options
    };
  }

  private static genGeometry(id: string, min: number, max: number): GameTask {
    const shapes = ['cuadrado', 'rectángulo'];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const isArea = Math.random() > 0.5;
    
    let answer = 0;
    let questionText = '';
    
    // Scale dimensions based on max
    const baseDim = max > 1000 ? 50 : 10;

    if (shape === 'cuadrado') {
      const side = Math.floor(Math.random() * baseDim) + 2;
      answer = isArea ? side * side : side * 4;
      questionText = isArea 
        ? `Área de un cuadrado cuyo lado mide ${side}cm` 
        : `Perímetro de un cuadrado cuyo lado mide ${side}cm`;
    } else {
      const w = Math.floor(Math.random() * baseDim) + 2;
      const h = Math.floor(Math.random() * (baseDim/2)) + 2;
      answer = isArea ? w * h : (w + h) * 2;
      questionText = isArea 
        ? `Área de un rectángulo (base ${w}cm, altura ${h}cm)` 
        : `Perímetro de un rectángulo (base ${w}cm, altura ${h}cm)`;
    }

    const options = this.generateOptions(answer, 0, max, 4);

    return {
      id,
      type: TaskType.GEOMETRY,
      prompt: 'Geometría básica',
      question: questionText,
      answer,
      options
    };
  }

  private static genCoordinates(id: string, min: number, max: number): GameTask {
    const x = Math.floor(Math.random() * 5);
    const y = Math.floor(Math.random() * 5);
    const answer = `${x},${y}`;
    
    const optionsStrings = [
      answer,
      `${Math.max(0, x-1)},${y}`,
      `${x},${Math.max(0, y-1)}`,
      `${y},${x}`
    ];
    // deduplicate and shuffle
    const options = Array.from(new Set(optionsStrings)).sort(() => Math.random() - 0.5);

    return {
      id,
      type: TaskType.COORDINATES,
      prompt: '¿Qué coordenadas tiene el punto?',
      question: { x, y },
      answer,
      options // answer is string here
    } as any;
  }

  private static genFunctions(id: string, min: number, max: number): GameTask {
    const types = ['Lineal', 'Cuadrática', 'Exponencial'];
    const chosenType = types[Math.floor(Math.random() * types.length)];
    
    let equation = '';
    switch (chosenType) {
      case 'Lineal': equation = `y = ${Math.floor(Math.random()*5)+1}x + ${Math.floor(Math.random()*5)}`; break;
      case 'Cuadrática': equation = `y = x² + ${Math.floor(Math.random()*5)}`; break;
      case 'Exponencial': equation = `y = ${Math.floor(Math.random()*2)+2}^x`; break;
    }

    return {
      id,
      type: TaskType.FUNCTIONS,
      prompt: 'Identifica el tipo de función',
      question: equation,
      answer: chosenType,
      options: types 
    } as any;
  }

  private static genCounting(id: string, min: number, max: number): GameTask {
    const count = Math.floor(Math.random() * (max - Math.max(min, 1) + 1)) + Math.max(min, 1);
    const item = [...FRUITS, ...ANIMALS][Math.floor(Math.random() * (FRUITS.length + ANIMALS.length))];
    
    const options = this.generateOptions(count, min, max, 4);
    
    return {
      id,
      type: TaskType.COUNTING,
      prompt: '¿Cuántos hay?',
      question: Array(count).fill(item),
      answer: count,
      options
    };
  }

  private static genMatching(id: string, min: number, max: number): GameTask {
    const count = Math.floor(Math.random() * (max - Math.max(min, 1) + 1)) + Math.max(min, 1);
    const options = this.generateOptions(count, min, max, 4);
    
    return {
      id,
      type: TaskType.MATCHING,
      prompt: 'Toca el número correcto',
      question: { count, icon: '⭐️' },
      answer: count,
      options
    };
  }

  private static genSequence(id: string, min: number, max: number): GameTask {
    const start = Math.floor(Math.random() * (max - 4 - min + 1)) + min;
    const sequence = [start, start + 1, start + 2];
    const answer = start + 3;
    const options = this.generateOptions(answer, Math.max(0, start - 5), answer + 5, 4);

    return {
      id,
      type: TaskType.SEQUENCE,
      prompt: '¿Qué número sigue?',
      question: sequence,
      answer,
      options
    };
  }

  private static genMissingNumber(id: string, min: number, max: number): GameTask {
    const start = Math.floor(Math.random() * (max - 3 - min + 1)) + min;
    const missingIndex = Math.floor(Math.random() * 3);
    const sequence: (number | null)[] = [start, start + 1, start + 2, start + 3];
    const answer = sequence[missingIndex + 1];
    sequence[missingIndex + 1] = null;

    const options = this.generateOptions(answer as number, min, max, 4);

    return {
      id,
      type: TaskType.MISSING_NUMBER,
      prompt: '¿Qué número falta?',
      question: sequence,
      answer,
      options
    };
  }

  private static genNumberLine(id: string, min: number, max: number): GameTask {
    const target = Math.floor(Math.random() * (max - min + 1)) + min;
    const start = Math.max(0, target - 5);
    const end = start + 10;
    
    return {
      id,
      type: TaskType.NUMBER_LINE,
      prompt: `Coloca el número ${target} en la recta`,
      question: { start, end },
      answer: target,
    };
  }

  private static genOrdering(id: string, min: number, max: number): GameTask {
    const ascending = Math.random() > 0.5;
    const nums: number[] = [];
    while (nums.length < 4) {
      const n = Math.floor(Math.random() * (max - min + 1)) + min;
      if (!nums.includes(n)) nums.push(n);
    }
    
    const sorted = [...nums].sort((a, b) => ascending ? a - b : b - a);
    
    return {
      id,
      type: TaskType.ORDERING,
      prompt: ascending ? 'Ordena de menor a mayor' : 'Ordena de mayor a menor',
      question: nums,
      answer: sorted,
    };
  }

  private static genComparison(id: string, min: number, max: number): GameTask {
    const n1 = Math.floor(Math.random() * (max - min + 1)) + min;
    let n2 = Math.floor(Math.random() * (max - min + 1)) + min;
    while (n1 === n2) n2 = Math.floor(Math.random() * (max - min + 1)) + min;
    
    const findMax = Math.random() > 0.5;
    const answer = findMax ? Math.max(n1, n2) : Math.min(n1, n2);
    
    return {
      id,
      type: TaskType.COMPARISON,
      prompt: findMax ? '¿Cuál es el más grande?' : '¿Cuál es el más pequeño?',
      question: [n1, n2],
      answer,
      options: [n1, n2]
    };
  }

  private static genPattern(id: string, min: number, max: number): GameTask {
    const step = [2, 5, 10][Math.floor(Math.random() * 3)];
    const start = Math.floor(Math.random() * (max - (step * 4) - min + 1)) + min;
    const sequence = [start, start + step, start + (step * 2)];
    const answer = start + (step * 3);
    const options = this.generateOptions(answer, min, max + step, 4);

    return {
      id,
      type: TaskType.PATTERN,
      prompt: '¿Qué número completa el patrón?',
      question: sequence,
      answer,
      options
    };
  }

  private static genAddition(id: string, min: number, max: number): GameTask {
    const n1 = Math.floor(Math.random() * (Math.floor(max / 2) + 1));
    const n2 = Math.floor(Math.random() * (Math.floor(max / 2) + 1));
    const answer = n1 + n2;
    const isMental = max > 30;
    
    const options = this.generateOptions(answer, min, max, 4);

    return {
      id,
      type: TaskType.ADDITION,
      prompt: isMental ? `¿Cuánto es ${n1} + ${n2}?` : 'Suma los objetos',
      question: isMental ? { n1, n2, symbol: '+' } : { n1, n2, icon: OBJECTS[Math.floor(Math.random() * OBJECTS.length)] },
      answer,
      options
    };
  }

  private static genSubtraction(id: string, min: number, max: number): GameTask {
    const n1 = Math.floor(Math.random() * (max - min + 1)) + min;
    const n2 = Math.floor(Math.random() * (n1 + 1));
    const answer = n1 - n2;
    const isMental = max > 30;
    
    const options = this.generateOptions(answer, 0, max, 4);

    return {
      id,
      type: TaskType.SUBTRACTION,
      prompt: isMental ? `¿Cuánto es ${n1} - ${n2}?` : 'Resta los objetos',
      question: isMental ? { n1, n2, symbol: '-' } : { n1, n2, icon: OBJECTS[Math.floor(Math.random() * OBJECTS.length)] },
      answer,
      options
    };
  }

  private static generateOptions(answer: number, min: number, max: number, count: number): number[] {
    const options = new Set<number>([answer]);
    while (options.size < count) {
      const offset = Math.floor(Math.random() * 11) - 5;
      const n = Math.max(min, Math.min(max, answer + offset));
      if (n !== answer || options.size === 1) { // ensures variety
        options.add(n);
      }
      
      // If we're stuck, just pick any random
      if (options.size < count && Math.random() > 0.8) {
        options.add(Math.floor(Math.random() * (max - min + 1)) + min);
      }
    }
    return Array.from(options).sort(() => Math.random() - 0.5);
  }
}
