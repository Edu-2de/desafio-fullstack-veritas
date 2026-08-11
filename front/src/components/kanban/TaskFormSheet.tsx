import Modal from './Modal'
import TaskForm, { type TaskFormProps } from './TaskForm'

export interface TaskFormSheetProps extends Omit<TaskFormProps, 'onCancel'> {
  open: boolean
  heading: string
  onClose: () => void
}

export default function TaskFormSheet({
  open,
  heading,
  onClose,
  ...formProps
}: TaskFormSheetProps) {
  return (
    <Modal open={open} title={heading} onClose={onClose}>
      <TaskForm {...formProps} onCancel={onClose} />
    </Modal>
  )
}
