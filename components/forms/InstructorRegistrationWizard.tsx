'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { instrutorSchema, type InstrutorFormData } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Step1DadosPessoaisInstrutor } from './wizard-steps-instrutor/Step1DadosPessoaisInstrutor';
import { Step2Especialidades } from './wizard-steps-instrutor/Step2Especialidades';
import { Step3Biografia } from './wizard-steps-instrutor/Step3Biografia';

interface InstructorRegistrationWizardProps {
  onSubmit: (data: InstrutorFormData) => void;
  isSubmitting: boolean;
  defaultValues?: Partial<InstrutorFormData>;
}

const STEPS = [
  { id: 1, title: 'Dados', description: 'Pessoais' },
  { id: 2, title: 'Especialidades', description: 'Áreas' },
  { id: 3, title: 'Biografia', description: 'Profissional' },
];

export function InstructorRegistrationWizard({
  onSubmit,
  isSubmitting,
  defaultValues,
}: InstructorRegistrationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [especialidades, setEspecialidades] = useState<string[]>(
    defaultValues?.especialidades || []
  );
  const [especialidadeError, setEspecialidadeError] = useState<string | undefined>();

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<InstrutorFormData>({
    resolver: zodResolver(instrutorSchema),
    defaultValues: defaultValues || {
      nome: '',
      email: '',
      telefone: '',
      especialidades: [],
      biografia: '',
    },
  });

  const progress = (currentStep / STEPS.length) * 100;

  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof InstrutorFormData)[] = [];

    switch (step) {
      case 1:
        fieldsToValidate = ['nome', 'email', 'telefone'];
        break;
      case 2:
        // Validar especialidades manualmente
        if (especialidades.length === 0) {
          setEspecialidadeError('Adicione pelo menos uma especialidade');
          return false;
        }
        setEspecialidadeError(undefined);
        if (!completedSteps.includes(step)) {
          setCompletedSteps([...completedSteps, step]);
        }
        return true;
      case 3:
        // Biografia é opcional, sempre válido
        if (!completedSteps.includes(step)) {
          setCompletedSteps([...completedSteps, step]);
        }
        return true;
    }

    const result = await trigger(fieldsToValidate as any);
    if (result && !completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFormSubmit = async (data: InstrutorFormData) => {
    // Validar step atual antes de submeter
    const isValid = await validateStep(currentStep);
    if (!isValid) return;

    // Validar especialidades
    if (especialidades.length === 0) {
      setEspecialidadeError('Adicione pelo menos uma especialidade');
      setCurrentStep(2);
      return;
    }

    onSubmit({
      ...data,
      especialidades,
    });
  };

  const handleAddEspecialidade = (esp: string) => {
    setEspecialidades([...especialidades, esp]);
    setEspecialidadeError(undefined);
  };

  const handleRemoveEspecialidade = (esp: string) => {
    setEspecialidades(especialidades.filter(e => e !== esp));
  };

  return (
    <div className="space-y-2">
      {/* Steps Indicator */}
      <div className="flex justify-between gap-1 py-1">
        {STEPS.map((step) => (
          <div
            key={step.id}
            className={`flex flex-col items-center flex-1 gap-1 ${
              step.id !== STEPS.length ? 'border-r border-border' : ''
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center ${
                completedSteps.includes(step.id)
                  ? 'bg-green-500 text-white'
                  : currentStep === step.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {completedSteps.includes(step.id) ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <span className="text-xs font-semibold">{step.id}</span>
              )}
            </div>
            <p className={`text-xs font-medium text-center leading-none ${
              currentStep === step.id ? 'text-foreground' : 'text-muted-foreground'
            }`}>
              {step.title}
            </p>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <p className="text-xs font-medium">
            Etapa {currentStep} de {STEPS.length}
          </p>
          <p className="text-xs text-muted-foreground">{Math.round(progress)}% completo</p>
        </div>
        <Progress value={progress} className="h-1" />
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-2">
        <div>
          {currentStep === 1 && (
            <Step1DadosPessoaisInstrutor
              register={register}
              errors={errors}
            />
          )}
          {currentStep === 2 && (
            <Step2Especialidades
              especialidades={especialidades}
              onAddEspecialidade={handleAddEspecialidade}
              onRemoveEspecialidade={handleRemoveEspecialidade}
              error={especialidadeError}
            />
          )}
          {currentStep === 3 && (
            <Step3Biografia
              register={register}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-2 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            size="sm"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Anterior
          </Button>

          {currentStep < STEPS.length ? (
            <Button type="button" onClick={handleNext} size="sm">
              Próximo
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting} size="sm">
              {isSubmitting ? 'Salvando...' : 'Finalizar Cadastro'}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
