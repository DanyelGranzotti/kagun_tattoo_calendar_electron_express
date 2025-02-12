import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  TimePicker,
  message,
} from "antd";
import React from "react";

function NovoAgendamentoModal({ isModalOpen, handleClose, handleSave }) {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const { nomeCliente, data, hora } = values;
    const dataHora = data.hour(hora.hour()).minute(hora.minute()).second(0);

    if (hora.hour() < 8 || hora.hour() > 18) {
      throw new Error("Os agendamentos devem ser entre 08:00 e 18:00.");
    }

    const novoAgendamento = {
      nomeCliente,
      data: dataHora.format("YYYY-MM-DD"),
      horario: dataHora.format("HH:mm"),
      idTatuador: 1,
    };

    await handleSave(novoAgendamento);
  };

  const onFinishFailed = (errorInfo) => {
    message.error(
      "Erro ao enviar formulário: " + errorInfo.errorFields[0].errors[0]
    );
  };

  return (
    <Modal
      title="Novo Agendamento"
      open={isModalOpen}
      onCancel={handleClose}
      footer={null}
      centered
    >
      <Form
        form={form}
        name="novoAgendamento"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
      >
        <Form.Item
          name="nomeCliente"
          label="Nome do Cliente"
          rules={[
            {
              required: true,
              message: "Por favor, insira o nome do cliente!",
            },
          ]}
          className="mb-2"
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="data"
          label="Data"
          rules={[{ required: true, message: "Por favor, selecione a data!" }]}
          className="mb-2"
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="hora"
          label="Hora"
          rules={[
            { required: true, message: "Por favor, selecione a hora!" },
            {
              validator: (_, value) =>
                value && (value.hour() < 8 || value.hour() > 18)
                  ? Promise.reject(
                      "Os agendamentos devem ser entre 08:00 e 18:00."
                    )
                  : Promise.resolve(),
            },
          ]}
          className="mb-2"
        >
          <TimePicker style={{ width: "100%" }} format="HH:mm" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Salvar Agendamento
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default NovoAgendamentoModal;
