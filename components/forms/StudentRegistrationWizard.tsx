'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { interessadoSchema, type InteressadoFormData } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import type { Curso, Turma } from '@/lib/types';
import { Step1DadosPessoais } from './wizard-steps/Step1DadosPessoais';
import { Step2Contato } from './wizard-steps/Step2Contato';
import { Step3ContextoSocial } from './wizard-steps/Step3ContextoSocial';
import { Step4Saude } from './wizard-steps/Step4Saude';
import { Step5Documentos } from './wizard-steps/Step5Documentos';
import { Step6VincularTurma } from './wizard-steps/Step6VincularTurma';

interface StudentRegistrationWizardProps {
  cursos: Curso[];
  turmas?: Turma[];
  onSubmit: (data: InteressadoFormData, turmaId?: string) => void;
  isSubmitting: boolean;
}

const STEPS = [
  { id: 1, title: 'Quem é', description: 'Dados pessoais' },
  { id: 2, title: 'Contato', description: 'Endereço' },
  { id: 3, title: 'Contexto Social', description: 'Responsável e emergência' },
  { id: 4, title: 'Saúde', description: 'Informações de saúde' },
  { id: 5, title: 'Documentos', description: 'Documentação' },
  { id: 6, title: 'Vincular Turma', description: 'Opcional' },
];

export function StudentRegistrationWizard({
  cursos,
  turmas = [],
  onSubmit,
  isSubmitting,
}: StudentRegistrationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [selectedTurmaId, setSelectedTurmaId] = useState<string | undefined>(undefined);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
    setValue,
  } = useForm<InteressadoFormData>({
    resolver: zodResolver(interessadoSchema),
    mode: 'onChange',
  });

  const progress = (currentStep / STEPS.length) * 100;

  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof InteressadoFormData)[] = [];

    switch (step) {
      case 1: // Quem é
        fieldsToValidate = ['nome', 'cpf', 'email', 'telefone', 'dataNascimento', 'genero', 'escolaridade', 'cursoInteresse'];
        break;
      case 2: // Contato
        fieldsToValidate = ['endereco'];
        break;
      case 3: // Contexto Social
        fieldsToValidate = ['contatoEmergenciaNome', 'contatoEmergenciaTelefone', 'contatoEmergenciaParentesco'];
        break;
      case 4: // Saúde
        fieldsToValidate = ['corRaca'];
        break;
      case 5: // Documentos
        // Documentos são opcionais, sempre válido
        return true;
      case 6: // Vincular Turma
        // Vincular turma é opcional, sempre válido
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

  const handleFormSubmit = async (data: InteressadoFormData) => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      onSubmit(data, selectedTurmaId);
    }
  };

  return (
    <div className="space-y-2">
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

      {/* Form Content */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-2">
        <div>
          {currentStep === 1 && (
            <Step1DadosPessoais
              register={register}
              errors={errors}
              setValue={setValue}
              cursos={cursos}
            />
          )}

          {currentStep === 2 && (
            <Step2Contato
              register={register}
              errors={errors}
            />
          )}

          {currentStep === 3 && (
            <Step3ContextoSocial
              register={register}
              errors={errors}
            />
          )}

          {currentStep === 4 && (
            <Step4Saude
              register={register}
              errors={errors}
              setValue={setValue}
              watch={watch}
            />
          )}

          {currentStep === 5 && (
            <Step5Documentos
              register={register}
              setValue={setValue}
              watch={watch}
            />
          )}

          {currentStep === 6 && (
            <Step6VincularTurma
              turmas={turmas}
              turmaId={selectedTurmaId}
              onTurmaChange={setSelectedTurmaId}
              ementaNome={watch('cursoInteresse')}
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
