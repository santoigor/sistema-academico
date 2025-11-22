'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cadastroVoluntarioSchema, type CadastroVoluntarioFormData } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Step1DadosPessoais } from './wizard-steps-voluntario/Step1DadosPessoais';
import { Step2Endereco } from './wizard-steps-voluntario/Step2Endereco';
import { Step3Voluntariado } from './wizard-steps-voluntario/Step3Voluntariado';
import { Step4IdentificacaoSaude } from './wizard-steps-voluntario/Step4IdentificacaoSaude';
import { Step5Origem } from './wizard-steps-voluntario/Step5Origem';

interface VolunteerRegistrationWizardProps {
  onSubmit: (data: CadastroVoluntarioFormData) => Promise<void>;
  isSubmitting?: boolean;
  defaultValues?: Partial<CadastroVoluntarioFormData>;
}

const STEPS = [
  { id: 1, name: 'Dados Pessoais', fields: ['nome', 'email', 'telefone', 'dataNascimento', 'genero', 'escolaridade'] },
  { id: 2, name: 'Endereço', fields: ['endereco.cep', 'endereco.rua', 'endereco.numero', 'endereco.bairro', 'endereco.cidade', 'endereco.estado'] },
  { id: 3, name: 'Voluntariado', fields: ['areaInteresse', 'motivoVoluntariado', 'habilidadesExperiencia', 'nivelDisponibilidade', 'experienciaVoluntariado'] },
  { id: 4, name: 'Identificação', fields: ['corRaca'] },
  { id: 5, name: 'Origem', fields: ['origem'] },
];

export function VolunteerRegistrationWizard({
  onSubmit,
  isSubmitting = false,
  defaultValues
}: VolunteerRegistrationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const form = useForm<CadastroVoluntarioFormData>({
    resolver: zodResolver(cadastroVoluntarioSchema),
    defaultValues: defaultValues || {
      nome: '',
      email: '',
      telefone: '',
      dataNascimento: '',
      genero: '',
      escolaridade: '',
      areaInteresse: '',
      endereco: {
        cep: '',
        rua: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
      },
      motivoVoluntariado: '',
      habilidadesExperiencia: '',
      nivelDisponibilidade: '',
      experienciaVoluntariado: false,
      detalhesExperienciaVoluntariado: '',
      corRaca: '',
      etnia: '',
      deficienciaFisica: false,
      deficienciaIntelectual: false,
      necessidadeEspecial: false,
      especificacaoDeficiencia: '',
      origem: '',
    },
    mode: 'onChange',
  });

  const { handleSubmit, trigger } = form;

  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  const validateCurrentStep = async () => {
    const currentStepFields = STEPS[currentStep - 1].fields as any[];
    const isValid = await trigger(currentStepFields);
    return isValid;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleStepClick = async (stepId: number) => {
    if (stepId < currentStep) {
      setCurrentStep(stepId);
    } else if (stepId === currentStep + 1) {
      await handleNext();
    }
  };

  const onFormSubmit = async (data: CadastroVoluntarioFormData) => {
    await onSubmit(data);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1DadosPessoais form={form} />;
      case 2:
        return <Step2Endereco form={form} />;
      case 3:
        return <Step3Voluntariado form={form} />;
      case 4:
        return <Step4IdentificacaoSaude form={form} />;
      case 5:
        return <Step5Origem form={form} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <p className="text-xs font-medium">Etapa {currentStep} de {STEPS.length}</p>
          <p className="text-xs text-muted-foreground">{Math.round(progress)}% completo</p>
        </div>
        <Progress value={progress} className="h-1" />
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between gap-1 py-1">
        {STEPS.map((step) => (
          <button
            key={step.id}
            type="button"
            onClick={() => handleStepClick(step.id)}
            disabled={step.id > currentStep + 1}
            className={`
              flex flex-col items-center flex-1 min-w-0
              ${step.id <= currentStep ? 'cursor-pointer' : 'cursor-not-allowed'}
            `}
          >
            <div
              className={`
                w-7 h-7 rounded-full flex items-center justify-center mb-1 transition-colors
                ${completedSteps.includes(step.id)
                  ? 'bg-primary text-white'
                  : step.id === currentStep
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-500'
                }
              `}
            >
              {completedSteps.includes(step.id) ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <span className="text-xs font-semibold">{step.id}</span>
              )}
            </div>
            <span className="text-[10px] text-center text-gray-600 leading-tight">
              {step.name}
            </span>
          </button>
        ))}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="min-h-[400px] py-4">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4 border-t">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 1 || isSubmitting}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>

          {currentStep < STEPS.length ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={isSubmitting}
              className="gap-1"
            >
              Próxima
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-1"
            >
              {isSubmitting ? 'Enviando...' : 'Finalizar Cadastro'}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
